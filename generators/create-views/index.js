var generators = require('yeoman-generator');
var chalk = require('chalk');

module.exports = generators.Base.extend({
  
  initializing: function () {
    this.elements = [];
    this.appelements = {};
  },
  
  getappelements: function (cb) {
    cb = cb || this.async();
    
    var prompts = [{
      type: 'input',
      name: 'modulename',
      message: chalk.blue('Module name')
    }, {
      type: "checkbox",
      name: "views",
      message: 'View Modules',
      choices: [
        {name: 'create', checked: true},
        {name: 'edit', checked: true},
        {name: 'view', checked: false},
        {name: 'list', checked: true}
      ]
    }]

    this.prompt(prompts, function (props) {
      this.appelements = props; 
      cb();
    }.bind(this));
    
  },
  
  getelements: function (cb) {
    cb = cb || this.async();
    var prompts = [{
      type: 'input',
      name: 'elementname',
      message: chalk.yellow('Element name')
    }, {
      type: 'input',
      name: 'elementtype',
      message: chalk.yellow('Element type')
    }, {
      type: 'input',
      name: 'elementlabel',
      message: chalk.yellow('Element label')
    }, {
      type: 'input',
      name: 'elementph',
      message: chalk.yellow('Example Text')
    }, {
      type: 'confirm',
      name: 'getanother',
      message: 'Do you want to continue?'
    }];

    this.prompt(prompts, function (props) {
      this.elements.push(props);
      if (props.getanother) {
        this.getelements(cb);
      } else {
      
        for (var index in this.appelements.views) {
          var viewname = this.appelements.views[index];
          this.fs.copyTpl(
            this.templatePath(viewname + '.client.view.html'),
            this.destinationPath('views/' + viewname + '.' + this.appelements.modulename.toLowerCase() + '.client.view.html'),
            {v: this.elements, v2: this.appelements});
        }
          
        cb();
      }
    }.bind(this));
  }

});