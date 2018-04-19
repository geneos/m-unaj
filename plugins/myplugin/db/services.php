<?php

// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Web service local plugin template external functions and service definitions.
 *
 * @package    localwstemplate
 * @copyright  2011 Jerome Mouneyrac
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// We defined the web service functions to install.
$functions = array(
    'local_myplugin_get_group_members' => array(         //web service function name
        'classname'   => 'local_myplugin_external',  //class containing the external function
        'methodname'  => 'get_group_members',          //external function name
        'classpath'   => 'local/myplugin/externallib.php',  //file containing the class/external function
        'description' => 'Get group members.',    //human readable description of the web service function
        'type'        => 'read'                  //database rights of the web service function (read, write)
    )
);

// We define the services to install as pre-build services. A pre-build service is not editable by administrator.
$services = array(
        'My service 2' => array(
                'functions' => array ('local_myplugin_get_group_members',),
                'restrictedusers' => 0,
                'enabled'=>1,
                'requiredcapability' => ''
        )
);
