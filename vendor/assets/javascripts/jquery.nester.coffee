class Nester
  constructor: (form, association) ->
    @form = $(form)
    @association = association
    @fieldset = @form.find "fieldset##{@association}s"
    @template = @fieldset.find('ol.blueprints').html()
    @template = @template + "<li><a href='#' class='remove_new'>Remove #{@association}</a></li>"


    @addLinks() # adding links when js is enabled
    @clickAdd()
    @clickRemoveNew()
    @clickRemoveExisting()
    @clickUndo()


  addLinks: ->
    @fieldset.prepend "<p><a class='btn add_#{@association}' href='#'><i class='icon-plus-sign'></i> Add #{@association}</a></p>"
    @form.find('li.destroy').hide() # hide if js
    # Using a link, similar to what is used with a new nested model fields but with a different class
    @fieldset.find('ol.existing li.destroy').after "<li><a href='#' class='remove_existing btn btn-danger'>Remove #{@association}</a></li>"


  clickAdd: ->
    @form.find("a.add_#{@association}").on 'click', (e) =>
      e.preventDefault()

      link = e.srcElement || e.target
      # Make a unique ID for the new child i.e.: training_module[attachments_attributes][1255929127459]
      new_id  = new Date().getTime()

      # Handle multiple nested models, instead of replacing all the models' id digits
      # ref: https://github.com/jashkenas/coffee-script/issues/709 => using interpolation with regex with ///
      findRegEx1 = ///#{@association}s_attributes_\d+///g
      replaceTo1 = "#{@association}s_attributes_#{new_id}"
      findRegEx2 = ///#{@association}s_attributes\]\[\d+///g
      replaceTo2 = "#{@association}s_attributes\]\[#{new_id}"
      @template = @template.replace(findRegEx1, replaceTo1).replace(findRegEx2, replaceTo2)

      # Create a new ol, which the new fields will be written into
      parent_fieldset = $(link).parent().parent()
      parent_fieldset.find("ol.#{@association}:last").after "<ol class='#{@association}'></ol>"
      new_fields = parent_fieldset.find 'ol:last'
      new_fields.hide().html(@template).slideDown()
      @form.trigger {type: "#{@association}:fieldsAdded", fields: new_fields}


  clickRemoveNew: ->
    @form.find('a.remove_new').live 'click', (e) =>
      link = e.srcElement || e.target
      $(link).parent().parent().slideUp -> $(@).remove()
      @form.trigger "#{@association}:fieldsRemoved"


  clickRemoveExisting: ->
    @form.find('a.remove_existing').on 'click', (e) =>
      e.preventDefault()
      link = e.srcElement || e.target
      ol = $(link).parent().parent()
      ol.addClass('removed').append "<li class='undo'><a href='#' class='undo'>undo removing #{@association}</a></li>"
      ol.find('li.destroy input[id*=destroy]').attr 'checked','checked'
      ol.find('li').slideUp()
      ol.find('li.undo').slideDown()
      @form.trigger "#{@association}:existingRemoved"


  clickUndo: ->
    @form.find('a.undo').live 'click', (e) =>
      e.preventDefault()
      link = e.srcElement || e.target
      ol = $(link).parent().parent()
      ol.removeClass('removed').find('li.destroy input[id*=destroy]').removeAttr 'checked'
      ol.find('li').slideDown()
      ol.find('li.destroy').hide()
      ol.find('li.undo').remove()
      @form.trigger "#{@association}:existingUndone"



do ($ = jQuery) ->
  $.fn.nester = (options) ->
    defaults =
      foo: 'bar'

    options = $.extend(defaults, options)

    @each -> new Nester(this, options.association)
