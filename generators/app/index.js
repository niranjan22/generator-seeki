var generators = require('yeoman-generator');
var chalk = require('chalk');

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
    
      for (var index in jsonObject.models) {
        var model = jsonObject.models[index];
        this.fs.copyTpl(
          this.templatePath('server.model.js'),
          this.destinationPath(projectname + '/app/models/' + model.paramname + '.server.model.js'),
          {model: model});
      }
      
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
        if(view.viewtype == 'create'){
          this.fs.copyTpl(
            this.templatePath('client.controller.js'),
            this.destinationPath(projectname + '/public/modules/' + view.modelparampluralname + '/controllers/' + view.modelparampluralname + '.client.controller.js'),
            {view: view});
        }
      }
     
      this.fs.copyTpl(
        this.templatePath('core.client.config.js'),
        this.destinationPath(projectname + '/public/modules/core/config/core.client.config.js'),
        {menus: project.menus});
    
      cb();
    }.bind(this));
  }

});