var generators = require('yeoman-generator'),
    chalk = require('chalk'),
    pl = require('pluralize'),
    cc = require('change-case');

module.exports = generators.Base.extend({

  initializing: function () {
    console.log(require('yeoman-welcome'));
    this.appelements = {};
  },

  getappelements: function (cb) {
    cb = cb || this.async();

    var prompts = {
      type: 'input',
      name: 'jsonfile',
      message: chalk.blue('JSON File')
    };
    
    this.prompt(prompts, function (input) {
      var project = this.fs.readJSON(input.jsonfile);
      project.name = cc.pascalCase(pl(project.name,1));
      var models = [];
      
      project.models.forEach ( function (model){
        var m = { name                  : model.name,
                  camelCaseSingular     : cc.camelCase(pl(model.name,1)),
                  camelCasePlural       : cc.camelCase(pl(model.name)),
                  paramCaseSingular     : cc.paramCase(pl(model.name,1)),
                  paramCasePlural       : cc.paramCase(pl(model.name)),
                  pascalCaseSingular    : cc.pascalCase(pl(model.name,1)),
                  pascalCasePlural      : cc.pascalCase(pl(model.name)),
                  upperCaseFirstSingular: cc.upperCaseFirst(pl(model.name,1)),
                  upperCaseFirstPlural  : cc.upperCaseFirst(pl(model.name)),
                  elements              : []
                };
        model.elements.forEach( function (element) {
          if (element.elementtype === 'Nested') {
            var e = {};
            if (element.isarray === true) {
              e = {elementname: element.elementname, elementtype: element.elementtype, isarray: element.isarray,
              elementNameSingular: pl(element.elementname,1), elements: element.elements};
            } else {
              e = {elementname: element.elementname, elementtype: element.elementtype, isarray: element.isarray, elements: element.elements};
            }
/*             if (element.isarray === true) {
              e.elementNameSingular = pl(element.elementname,1);
            } */
            m.elements.push(e);
          } else {
            m.elements.push(element);
          }
        });
        models.push(m);
      });
      
      //Generate model outputs
      for (var index in project.models) {
        var model = project.models[index];
        this.fs.copyTpl(
          this.templatePath('server.model.js'),
          this.destinationPath(project.name + '/app/models/' + model.paramCaseSingular + '.server.model.js'),
          {model: model});
      };
      
      //Generate view outputs
      for (var index in project.views) {
        var view = project.views[index];
        var model = models.filter( function (m) {
          if (m.name === view.modelname) {
            return m;
          }
        })[0];
        view.model = model;
        for (var sindex in view.sections) {
          var section = view.sections[sindex];
          for (var cindex in section.controls) {
            var control = section.controls[cindex];
            if (control.controltype === 'Nested') {
              if (control.isarray === true) {
                control.modelelementSl = pl(control.modelelement,1);
                //control.modelelementPL = pl(control.modelelement);
              }
            }
            section.controls[cindex] = control;
          };
          view.sections[sindex] = section;
        };
        if(view.viewtype == 'list'){
          this.fs.copyTpl(
            this.templatePath(view.viewtype + '-client.view.html'),
            this.destinationPath(project.name + '/public/modules/' + model.paramCasePlural + '/views/' + view.viewtype + '-' + model.paramCasePlural + '.client.view.html'),
            {view: view, model: model});
        }else{
          this.fs.copyTpl(
            this.templatePath(view.viewtype + '-client.view.html'),
            this.destinationPath(project.name + '/public/modules/' + model.paramCasePlural + '/views/' + view.viewtype + '-' + model.paramCaseSingular + '.client.view.html'),
            {view: view, model: model});
        }
      };


      //Generate controllers
      for (var index in project.controllers) {
        var controller = project.controllers[index];
        var model = models.filter(function (m) {
          if (m.name === controller.modelname) {
            return m;
          }
        })[0];

        var services = [];
        controller.services.forEach( function (service) {
          services.push (cc.pascalCase(pl(service)));
        });
        controller.services = services;

        this.fs.copyTpl(
          this.templatePath('client.controller.js'),
          this.destinationPath(project.name + '/public/modules/' + model.paramCasePlural + '/controllers/' + model.paramCasePlural + '.client.controller.js'),
          {controller: controller, model: model}
        );
      };

      var menus = [];
      project.menus.forEach( function (menu) {
        var m = {menuname: cc.titleCase(menu.menuname),
        menulabel: cc.titleCase(menu.menulabel),
        submenus: []};
        menu.submenus.forEach( function (submenu) {
          if (submenu.modelname){
            submenu = {mainmenuname: submenu.mainmenuname,
                      submenulabel: cc.titleCase(cc.sentenceCase(pl(submenu.modelname))),
                      submenuname: cc.paramCase(pl(submenu.modelname))}
            m.submenus.push(submenu);
          }
        });
        menus.push(m);
      });

      this.fs.copyTpl(
        this.templatePath('core.client.config.js'),
        this.destinationPath(project.name + '/public/modules/core/config/core.client.config.js'),
        {menus: menus});

      cb();
    }.bind(this));
  }

});