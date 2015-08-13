'use strict';

// Configuring the Core module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
    <% menus.forEach(function(menu) { %>
      Menus.addMenuItem('topbar', '<%= menu.menulabel %>', '<%= menu.menuname %>', 'dropdown');
      <% menu.submenus.forEach(function(submenu) { %>Menus.addSubMenuItem('topbar', '<%= submenu.mainmenuname %>', '<%= submenu.submenulabel %>', '<%= submenu.submenuname %>');
      <% }); %><% }); %>
	}
]);
