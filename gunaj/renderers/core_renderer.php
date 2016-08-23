<?php
// This file is part of The Bootstrap 3 Moodle theme
//
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

defined('MOODLE_INTERNAL') || die();

/**
 * Renderers to align Moodle's HTML with that expected by Bootstrap
 *
 * @package    theme_elegance
 * @copyright  2012
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
 

class theme_gunaj_core_renderer extends theme_elegance_core_renderer {


    public function user_menu_custom() {
        global $CFG;
        $usermenu = new custom_menu('', current_language());
        return $this->render_user_menu_custom($usermenu);
    }

    protected function render_user_menu_custom(custom_menu $menu) {
        global $CFG, $USER, $DB, $PAGE; //Elegance add $PAGE;


            $unajMainConfig = theme_config::load('gunaj');
            
            if (isloggedin()) {
                $usermenu = $menu->add(fullname($USER), new moodle_url('#'), fullname($USER), 10001);

                if (!empty($unajMainConfig->settings->enablemy)) {
                  $usermenu->add(
                    '<i class="fa fa-briefcase"></i>' . get_string('mydashboard','theme_gunaj'),
                    new moodle_url('/my', array('id'=>$USER->id)),
                    get_string('mydashboard','theme_gunaj')
                  );
                }

                if (!empty($unajMainConfig->settings->enableprofile)) {
                  $usermenu->add(
                    '<i class="fa fa-user"></i>' . get_string('viewprofile'),
                    new moodle_url('/user/profile.php', array('id' => $USER->id)),
                    get_string('viewprofile')
                  );
                }

                if (!empty($unajMainConfig->settings->enableeditprofile)) {
                  $usermenu->add(
                    '<i class="fa fa-cog"></i>' . get_string('editmyprofile'),
                    new moodle_url('/user/edit.php', array('id' => $USER->id)),
                    get_string('editmyprofile')
                  );
                }

                if (!empty($unajMainConfig->settings->enableprivatefiles)) {
                  $usermenu->add(
                    '<i class="fa fa-file"></i>' . get_string('privatefiles', 'block_private_files'),
                    new moodle_url('/user/files.php', array('id' => $USER->id)),
                    get_string('privatefiles', 'block_private_files')
                  );
                }

                if (!empty($unajMainConfig->settings->enablebadges)) {
                  $usermenu->add(
                    '<i class="fa fa-certificate"></i>' . get_string('badges'),
                    new moodle_url('/badges/mybadges.php', array('id' => $USER->id)),
                    get_string('badges')
                  );
              }

                if (!empty($unajMainConfig->settings->enablecalendar)) {
                  $usermenu->add(
                    '<i class="fa fa-calendar"></i>' . get_string('pluginname', 'block_calendar_month'),
                    new moodle_url('/calendar/view.php', array('id' => $USER->id)),
                    get_string('pluginname', 'block_calendar_month')
                  );
                }

                // Add custom links to menu
                $customlinksnum = (empty($unajMainConfig->settings->usermenulinks)) ? false : $unajMainConfig->settings->usermenulinks;
                if ($customlinksnum !=0) {
                    foreach (range(1, $customlinksnum) as $customlinksnumber) {
                        $cli = "customlinkicon$customlinksnumber";
                        if(!empty($PAGE->theme->settings->$cli)) {
                            $cli = '<i class="fa fa-'. $PAGE->theme->settings->$cli . '"></i>';
                        } else {
                            $cli = '';
                        }
                        $cln = "customlinkname$customlinksnumber";
                        $clu = "customlinkurl$customlinksnumber";

                        if (!empty($unajMainConfig->settings->$cln) && !empty($unajMainConfig->settings->$clu)) {
                            $usermenu->add(
                                $cli . $unajMainConfig->settings->$cln,
                                new moodle_url($unajMainConfig->settings->$clu),
                                $unajMainConfig->settings->$cln
                            );
                        }
                    }
                }

                $usermenu->add(
                    '<i class="fa fa-lock"></i>' . get_string('logout'),
                    new moodle_url('/login/logout.php', array('sesskey' => sesskey(), 'alt' => 'logout')),
                    get_string('logout')
                );

            }

        $content = '<ul class="nav navbar-nav navbar-right">';
        foreach ($menu->get_children() as $item) {
            $content .= $this->render_custom_menu_item($item, 1);
        }

        return $content.'</ul>';
    }

}
