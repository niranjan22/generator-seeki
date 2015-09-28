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
      var project = this.fs.readJSON(input.jsonfile, "utf-8");
      project.name = cc.pascalCase(pl(project.name,1));
      var models = [];
      
      project.models.push({name: 'User'});
      console.log('building models....');
      project.models.forEach ( function (model){
        var m = { name                  : model.name,
                  camelCaseSingular     : cc.camelCase(pl(model.name,1)),
                  camelCasePlural       : cc.camelCase(pl(model.name)),
                  paramCaseSingular     : cc.paramCase(pl(model.name,1)),
                  paramCasePlural       : cc.paramCase(pl(model.name)),
                  pascalCaseSingular    : cc.pascalCase(pl(model.name,1)),
                  pascalCasePlural      : cc.pascalCase(pl(model.name)),
                  upperCaseFirstSingular: cc.upperCaseFirst(pl(model.name,1)),
                  titleCaseSingular     : cc.titleCase(pl(model.name,1)),
                  titleCasePlural       : cc.titleCase(pl(model.name)),
                  upperCaseFirstPlural  : cc.upperCaseFirst(pl(model.name)),
                  elements              : []
                };
        m.sequence = model.sequence;
        
        if (model.elements) {
          console.log('processing models, ', model.name);
          model.elements.forEach( function (element) {
            console.log('processing element, ', element.elementname);
            if (element.elementtype === 'Nested') {
              var e = {};
              if (element.isarray === true) {
                e = {elementname: element.elementname, elementtype: element.elementtype, isarray: element.isarray,
                elementNameSingular: pl(element.elementname,1), elements: element.elements};
                e.elements.forEach( function (ne) {
                  if (ne.elementtype === 'Schema.Types.ObjectId') {
                    var dmodelName = project.models.filter( function (ml) {
                      if (ne.schemaobjref === ml.name){
                        return ml;
                      }
                    })[0].name;
                    
                    ne.schemaobjref = cc.pascalCase(pl(dmodelName,1));
                    ne.camelCaseSchemaobjref = cc.camelCase(pl(dmodelName));
                    ne.pascalCaseSchemaobjref = cc.pascalCase(pl(dmodelName));
                  }
                });
                
                e.resolveLookups = '';
                e.elements.forEach( function (ne) {
                  if (ne.elementtype === 'Schema.Types.ObjectId') {
                    e.resolveLookups = e.resolveLookups + ', \n' + ne.camelCaseSchemaobjref + ': function () { return ' + ne.pascalCaseSchemaobjref + '.query(); }'
                  }
                });
                
                e.modelDependencies = [];
                e.elements.forEach( function (ne) {
                  if (ne.elementtype === 'Schema.Types.ObjectId') {
                    e.modelDependencies.push(ne.camelCaseSchemaobjref);
                  }
                });
                
              } else {
                e = {elementname: element.elementname, elementtype: element.elementtype, elementNameSingular: pl(element.elementname,1), isarray: false, elements: element.elements};
                e.elements.forEach( function (ne) {
                  if (ne.elementtype === 'Schema.Types.ObjectId') {
                    var dmodelName = project.models.filter( function (ml) {
                      if (ne.schemaobjref === ml.name){
                        return ml;
                      }
                    })[0].name;
                    
                    ne.schemaobjref = cc.pascalCase(pl(dmodelName,1));
                    ne.camelCaseSchemaobjref = cc.camelCase(pl(dmodelName));
                    ne.pascalCaseSchemaobjref = cc.pascalCase(pl(dmodelName));
                  }
                });  
                e.resolveLookups = '';
                e.elements.forEach( function (ne) {
                  if (ne.elementtype === 'Schema.Types.ObjectId') {
                    e.resolveLookups = e.resolveLookups + '\n $scope.' + ne.camelCaseSchemaobjref + ' = ' + ne.pascalCaseSchemaobjref + '.query();'
                  }
                });                
                
              }
  /*             if (element.isarray === true) {
                e.elementNameSingular = pl(element.elementname,1);
              } */
              m.elements.push(e);
            } else {
              if (element.elementtype === 'Schema.Types.ObjectId') {
                element.schemaobjref = cc.pascalCase(pl(element.schemaobjref,1));
                element.camelCaseSchemaobjref = cc.camelCase(pl(element.schemaobjref));
                element.pascalCaseSchemaobjref = cc.pascalCase(pl(element.schemaobjref));                
              }            
              m.elements.push(element);
            }
          });
        }
        models.push(m);
      });
      
      console.log('generating server routes... ');
      //Generate server routes
      for (var index in models) {
        var model = models[index];
        if (model.name !== 'User'){
          this.fs.copyTpl(
            this.templatePath('server.routes.js'),
            this.destinationPath(project.name + '/app/routes/' + model.paramCasePlural + '.server.routes.js'),
            {model: model});
        }
      };   

      console.log('generating server controllers... ');
      //Generate server controllers
      for (var index in models) {
        var model = models[index];
        if (model.name !== 'User'){
          this.fs.copyTpl(
            this.templatePath('server.controller.js'),
            this.destinationPath(project.name + '/app/controllers/' + model.paramCasePlural + '.server.controller.js'),
            {model: model});
        }
      };   
      
      console.log('generating server models... ');
      //Generate server models
      for (var index in models) {
        var model = models[index];
        if (model.name !== 'User'){
          this.fs.copyTpl(
            this.templatePath('server.model.js'),
            this.destinationPath(project.name + '/app/models/' + model.paramCaseSingular + '.server.model.js'),
            {model: model});
        }
      };
      
      console.log('generating client views...');
      //Generate client views
      for (var index in project.views) {
        var view = project.views[index];
        console.log('processing view, ', view.viewname);
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
            console.log('processing control, ', control.controlname);
            if (control.controltype === 'Nested') {
              if (control.isarray === true) {
                control.modelelementSl = pl(control.modelelement,1);
                //control.modelelementPL = pl(control.modelelement);
              }
              
              control.nestedcontrols.forEach( function (nestedControl) {
                console.log('processing nested control, ', nestedControl.controlname);
                if (nestedControl.controltype === 'Select' && (nestedControl.modelname)) {
                  var m = models.filter( function (md) {
                    if (md.name === nestedControl.modelname) {
                      return md;
                    }
                  })[0];
                  nestedControl.optionsCreate = m.camelCaseSingular + ' as ' + m.camelCaseSingular + '.' + nestedControl.displayelement + ' for ' + m.camelCaseSingular + ' in ' + m.camelCasePlural;
                  nestedControl.optionsEdit = m.camelCaseSingular + '._id as ' + m.camelCaseSingular + '.' + nestedControl.displayelement + ' for ' + m.camelCaseSingular + ' in ' + m.camelCasePlural;
                }                
              });
            }
            if (control.controltype === 'Select' && (control.modelname)) {
              var m = models.filter( function (md) {
                if (md.name === control.modelname) {
                  return md;
                }
              })[0];
              
              var displayelement = '';
              if(control.displayelement){
                displayelement = control.displayelement;
              }else{
                displayelement = 'name';
              }
              control.optionsCreate = m.camelCaseSingular + ' as ' + m.camelCaseSingular + '.' + control.displayelement + ' for ' + m.camelCaseSingular + ' in ' + m.camelCasePlural;
              control.optionsEdit = m.camelCaseSingular + '._id as ' + m.camelCaseSingular + '.' + control.displayelement + ' for ' + m.camelCaseSingular + ' in ' + m.camelCasePlural;
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
            {view: view});
        }
      };

      console.log('generating client side components...');
      //Generate client components; services, routes, module and controllers
      for (var index in project.controllers) {
        var controller = project.controllers[index];
        console.log('processing controller, ', controller.controllername);
        var model = models.filter(function (m) {
          if (m.name === controller.modelname) {
            return m;
          }
        })[0];
        
        console.log('generating client module...');
        //Generate client module
        this.fs.copyTpl(
          this.templatePath('client.module.js'),
          this.destinationPath(project.name + '/public/modules/' + model.paramCasePlural + '/' + model.paramCasePlural + '.client.module.js'),
          {model: model}
        );        
        
        console.log('generating client routes...');
        //Generate client routes
        this.fs.copyTpl(
          this.templatePath('client.routes.js'),
          this.destinationPath(project.name + '/public/modules/' + model.paramCasePlural + '/config/' + model.paramCasePlural + '.client.routes.js'),
          {model: model}
        );   
        
        console.log('generating client services...');
        //Generate client services
        this.fs.copyTpl(
          this.templatePath('client.service.js'),
          this.destinationPath(project.name + '/public/modules/' + model.paramCasePlural + '/services/' + model.paramCasePlural + '.client.service.js'),
          {model: model}
        );   
        
        var services = [];
        controller.services.forEach( function (service) {
          services.push (cc.pascalCase(pl(service)));
        });
        controller.services = services;

        console.log('generating client controllers...');
        //Generate client controllers        
        this.fs.copyTpl(
          this.templatePath('client.controller.js'),
          this.destinationPath(project.name + '/public/modules/' + model.paramCasePlural + '/controllers/' + model.paramCasePlural + '.client.controller.js'),
          {controller: controller, model: model}
        );
        
      };

      console.log('generating menus...');
      //Generate menus
      var menus = [];
      project.menus.forEach( function (menu) {
        console.log('processing menu, ', menu.menuname);
        var m = {menuname: cc.lowerCase(menu.menuname),
        menulabel: cc.titleCase(menu.menulabel),
        submenus: []};
        menu.submenus.forEach( function (submenu) {
          if (submenu.modelname){
            submenu = {mainmenuname: cc.lowerCase(submenu.mainmenuname),
                      submenulabel: cc.titleCase(cc.sentenceCase(pl(submenu.modelname))),
                      submenuname: cc.paramCase(pl(submenu.modelname))}
            m.submenus.push(submenu);
            console.log('processing submenu, ', submenu.submenuname);
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