(function() {
  var Nester;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Nester = (function() {
    function Nester(form, association) {
      this.form = $(form);
      this.association = association;
      this.fieldset = this.form.find("fieldset#" + this.association + "s");
      this.template = this.fieldset.find('ol.blueprints').html();
      this.template = this.template + ("<li><a href='#' class='remove_new'>Remove " + this.association + "</a></li>");
      this.addLinks();
      this.clickAdd();
      this.clickRemoveNew();
      this.clickRemoveExisting();
      this.clickUndo();
    }
    Nester.prototype.addLinks = function() {
      this.fieldset.prepend("<p><a class='btn add_" + this.association + "' href='#" + this.association + "s'><i class='icon-plus-sign'></i> Add " + this.association + "</a></p>");
      this.form.find('li.destroy').hide();
      return this.fieldset.find('ol.existing li.destroy').after("<li><a href='#" + this.association + "s' class='remove_existing_" + this.association + " btn btn-danger'>Remove " + this.association + "</a></li>");
    };
    Nester.prototype.clickAdd = function() {
      return this.form.find("a.add_" + this.association).on('click', __bind(function(e) {
        var findRegEx1, findRegEx2, link, new_fields, new_id, parent_fieldset, replaceTo1, replaceTo2;
        e.preventDefault();
        link = e.srcElement || e.target;
        new_id = new Date().getTime();
        findRegEx1 = RegExp("" + this.association + "s_attributes_\\d+", "g");
        replaceTo1 = "" + this.association + "s_attributes_" + new_id;
        findRegEx2 = RegExp("" + this.association + "s_attributes\\]\\[\\d+", "g");
        replaceTo2 = "" + this.association + "s_attributes\]\[" + new_id;
        this.template = this.template.replace(findRegEx1, replaceTo1).replace(findRegEx2, replaceTo2);
        parent_fieldset = $(link).parent().parent();
        parent_fieldset.find("ol." + this.association + ":last").after("<ol class='" + this.association + "'></ol>");
        new_fields = parent_fieldset.find('ol:last');
        new_fields.hide().html(this.template).slideDown();
        return this.form.trigger({
          type: "" + this.association + ":fieldsAdded",
          fields: new_fields
        });
      }, this));
    };
    Nester.prototype.clickRemoveNew = function() {
      return this.form.find('a.remove_new').live('click', __bind(function(e) {
        var link;
        e.preventDefault();
        link = e.srcElement || e.target;
        $(link).parent().parent().slideUp(function() {
          return $(this).remove();
        });
        return this.form.trigger("" + this.association + ":fieldsRemoved");
      }, this));
    };
    Nester.prototype.clickRemoveExisting = function() {
      return this.form.find("a.remove_existing_" + this.association).on('click', __bind(function(e) {
        var link, ol;
        e.preventDefault();
        link = e.srcElement || e.target;
        ol = $(link).parent().parent();
        ol.addClass('removed').append("<li class='undo'><a href='#' class='undo'>undo removing " + this.association + "</a></li>");
        ol.find('li.destroy input[id*=destroy]').attr('checked', 'checked');
        ol.find('li').slideUp();
        ol.find('li.undo').slideDown();
        return this.form.trigger("" + this.association + ":existingRemoved");
      }, this));
    };
    Nester.prototype.clickUndo = function() {
      return this.form.find('a.undo').live('click', __bind(function(e) {
        var link, ol;
        e.preventDefault();
        link = e.srcElement || e.target;
        ol = $(link).parent().parent();
        ol.removeClass('removed').find('li.destroy input[id*=destroy]').removeAttr('checked');
        ol.find('li').slideDown();
        ol.find('li.destroy').hide();
        ol.find('li.undo').remove();
        return this.form.trigger("" + this.association + ":existingUndone");
      }, this));
    };
    return Nester;
  })();
  (function($) {
    if ($ == null) {
      $ = jQuery;
    }
    return $.fn.nester = function(options) {
      var defaults;
      defaults = {
        foo: 'bar'
      };
      options = $.extend(defaults, options);
      return this.each(function() {
        return new Nester(this, options.association);
      });
    };
  })($);
}).call(this);
