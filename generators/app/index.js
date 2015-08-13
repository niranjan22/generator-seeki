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
    }
    this.prompt(prompts, function (ans) {
      
      var jsonfile = ans.jsonfile;
      var jsonObject = this.fs.readJSON(jsonfile);
      var project = jsonObject;
      var projectname = project.name.toLowerCase().replace(" ", "");
      var model = {};
      
      for (var index in project.models) {
        var m = project.models[index];
        model = { name                  : m.name,
                  camelCaseSingular     : cc.camelCase(pl(m.name,1)),
                  camelCasePlural       : cc.camelCase(pl(m.name)),
                  paramCaseSingular     : cc.paramCase(pl(m.name,1)),
                  paramCasePlural       : cc.paramCase(pl(m.name)),
                  pascalCaseSingular    : cc.pascalCase(pl(m.name,1)),
                  pascalCasePlural      : cc.pascalCase(pl(m.name)),
                  upperCaseFirstSingular: cc.upperCaseFirst(pl(m.name,1)),
                  upperCaseFirstPlural  : cc.upperCaseFirst(pl(m.name)),
                  elements              : m.elements
                };
        this.fs.copyTpl(
          this.templatePath('server.model.js'),
          this.destinationPath(projectname + '/app/models/' + model.paramCaseSingular + '.server.model.js'),
          {model: model});
      }
      
      /*
      for (var index in jsonObject.views) {
        var view = jsonObject.views[index];
        
        if(view.viewtype == 'list'){
          this.fs.copyTpl(
            this.templatePath(view.viewtype + '-client.view.html'),
            this.destinationPath(projectname + '/public/modules/' + view.modelparampluralname + '/views/' + view.viewtype + '-' + view.modelparampluralname + '.client.view.html'),
            {view: view});
        }else{
          this.fs.copyTpl(        
            this.templatePath(view.viewtype + '-client.view.html'),
            this.destinationPath(projectname + '/public/modules/' + view.modelparampluralname + '/views/' + view.viewtype + '-' + view.modelparamname + '.client.view.html'),
            {view: view});
        
        }
      }
      */
      
      //todo: create a seperate loop to load all controllers

      for (var index in project.controllers) {
        var controller = project.controllers[index];
        
        var m = project.models.filter(function (model) {
          if (model.name === controller.modelname) {
            return model;
          }
        })[0];
        model = { name                  : m.name,
                  camelCaseSingular     : cc.camelCase(pl(m.name,1)),
                  camelCasePlural       : cc.camelCase(pl(m.name)),
                  paramCaseSingular     : cc.paramCase(pl(m.name,1)),
                  paramCasePlural       : cc.paramCase(pl(m.name)),
                  pascalCaseSingular    : cc.pascalCase(pl(m.name,1)),
                  pascalCasePlural      : cc.pascalCase(pl(m.name)),
                  upperCaseFirstSingular: cc.upperCaseFirst(pl(m.name,1)),
                  upperCaseFirstPlural  : cc.upperCaseFirst(pl(m.name)),
                  elements              : m.elements
                };
        var qservices = controller.services.toString().replace(/,/g,"','");
        
        this.fs.copyTpl(
          this.templatePath('client.controller.js'),
          this.destinationPath(projectname + '/public/modules/' + model.paramCasePlural + '/controllers/' + model.paramCasePlural + '.client.controller.js'),
          {controller: controller, 
          model: model, services: controller.services.toString(), 
          qservices: qservices}
        );
      }
      
      for (var index in project.menus) {
        for (var sindex in project.menus[index].submenus) {
          var submenu = project.menus[index].submenus[sindex];
          if (submenu.modelname){
            submenu = {mainmenuname: submenu.mainmenuname,
                      submenulabel: cc.titleCase(cc.sentenceCase(pl(submenu.modelname))),
                      submenuname: cc.paramCase(pl(submenu.modelname))}
            project.menus[index].submenus[sindex] = submenu;
          }
        };
      };
      
      
      this.fs.copyTpl(
        this.templatePath('core.client.config.js'),
        this.destinationPath(projectname + '/public/modules/core/config/core.client.config.js'),
        {menus: project.menus});
    
      cb();
    }.bind(this));
  }

});