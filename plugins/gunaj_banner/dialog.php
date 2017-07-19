<?php
// This file is part of Moodle - http://moodle.org/
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

/**
 * Displays the TinyMCE popup window to insert a Moodle gunaj_banner
 *
 * @package   tinymce_gunaj_banner
 * @copyright 2016 Cooperativa GENEOS
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('NO_MOODLE_COOKIES', true); // Session not used here.

require(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))) . '/config.php');

$PAGE->set_context(context_system::instance());
$PAGE->set_url('/lib/editor/tinymce/plugins/gunaj_banner/dialog.php');

$stringmanager = get_string_manager();

$editor = get_texteditor('tinymce');
$plugin = $editor->get_plugin('gunaj_banner');

$htmllang = get_html_lang();
header('Content-Type: text/html; charset=utf-8');
header('X-UA-Compatible: IE=edge');
?>
<!DOCTYPE html>
<html <?php echo $htmllang ?>
<head>
    <title><?php print_string('gunaj_banner:desc', 'tinymce_gunaj_banner'); ?></title>
    <script type="text/javascript" src="<?php echo $editor->get_tinymce_base_url(); ?>/tiny_mce_popup.js"></script>
    <script type="text/javascript" src="<?php echo $plugin->get_tinymce_file_url('js/dialog.js'); ?>"></script>
</head>
<body>

<div>
    <fieldset>
        <legend><?php print_string('gunaj_banner:general_settings', 'tinymce_gunaj_banner'); ?></legend>

        <table border="0" cellpadding="4" cellspacing="0" role="presentation">
            <tr>
                    <td><label id="titlelabel" for="title"><?php print_string('gunaj_banner:titlelabel', 'tinymce_gunaj_banner'); ?></label></td>
                    <td>
                        <input id="gunaj_banner_title" name="title" type="text" class="mceFocus" value="" aria-required="true" style="width: 180px;"/>
                    </td>
            </tr>
             <tr>
                    <td><label id="descriptionlabel" for="title"><?php print_string('gunaj_banner:descriptionlabel', 'tinymce_gunaj_banner'); ?></label></td>
                    <td>
                        <input id="gunaj_banner_description" name="description" type="text" class="mceFocus" value="" aria-required="false" style="width: 180px;"></input>
                    </td>
            </tr>
            <tr>
                    <td><label id="lefttitlelabel" for="text"><?php print_string('gunaj_banner:lefttitlelabel', 'tinymce_gunaj_banner'); ?></label></td>
                    <td><input id="gunaj_banner_lefttitle" name="lefttitle" type="text" class="mceFocus" value="" aria-required="false" style="width: 100px;"></td>
            </tr>
            <tr>
                    <td><label id="leftnumberlabel" for="text"><?php print_string('gunaj_banner:leftnumberlabel', 'tinymce_gunaj_banner'); ?></label></td>
                    <td><input id="gunaj_banner_leftnumber" name="leftnumber" type="text" class="mceFocus" value="" aria-required="false" style="width: 50px;"></td>
            </tr>
        </table>
    </fieldset>
</div>
    <div class="mceActionPanel">
        <input type="button" id="insert" name="insert" value="{#insert}" onclick='MoodleGUnajBannerDialog.insert(document.getElementById("gunaj_banner_title").value,document.getElementById("gunaj_banner_description").value,document.getElementById("gunaj_banner_lefttitle").value,document.getElementById("gunaj_banner_leftnumber").value);' />
        <input type="button" id="cancel" name="cancel" value="{#cancel}" onclick="tinyMCEPopup.close();" />
    </div>

</body>
</html>