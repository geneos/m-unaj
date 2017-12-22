<?php
// This file is part of the custom Moodle elegance theme
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
 * gunaj_green theme for the underlying Elegance theme.
 *
 * @package    theme
 * @subpackage gunaj_green
 * @author	   Cooperativa GENEOS
 * @author     Based on code originally written by G J Barnard, Mary Evans, Bas Brands, Stuart Lamour and David Scotson.
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
$settings = null;

defined('MOODLE_INTERNAL') || die;

	global $PAGE;

	$ADMIN->add('themes', new admin_category('theme_gunaj_green', 'gunaj_green'));

	// "geneicsettings" settingpage
	$temp = new admin_settingpage('theme_gunaj_greengeneric',  get_string('geneicsettings', 'theme_gunaj_green'));

	// Invert Navbar to dark background.
    $name = 'theme_gunaj_green/invert';
    $title = get_string('invert', 'theme_gunaj_green');
    $description = get_string('invertdesc', 'theme_gunaj_green');
    $setting = new admin_setting_configcheckbox($name, $title, $description, 0);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);
	
	$ADMIN->add('theme_gunaj_green', $temp);
	
	/* Color and Logo Settings */
    $temp = new admin_settingpage('theme_gunaj_green_colors', get_string('colorsettings', 'theme_gunaj_green'));
    $temp->add(new admin_setting_heading('theme_gunaj_green_colors', get_string('colorsettingssub', 'theme_gunaj_green'),
    		format_text(get_string('colorsettingsdesc' , 'theme_gunaj_green'), FORMAT_MARKDOWN)));

        // Main theme colour setting.
        $name = 'theme_gunaj_green/themecolor';
        $title = get_string('themecolor', 'theme_gunaj_green');
        $description = get_string('themecolordesc', 'theme_gunaj_green');
        $default = '#8ab03f';
        $previewconfig = null;
        $setting = new admin_setting_configcolourpicker($name, $title, $description, $default, $previewconfig);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

    	// Logo Image.
    	$name = 'theme_gunaj_green/logo';
    	$title = get_string('logo', 'theme_gunaj_green');
    	$description = get_string('logodesc', 'theme_gunaj_green');
    	$setting = new admin_setting_configstoredfile($name, $title, $description, 'logo');
    	$setting->set_updatedcallback('theme_reset_all_caches');
    	$temp->add($setting);
		
    	// Heading colour setting.
    	$name = 'theme_gunaj_green/headingcolor';
    	$title = get_string('headingcolor', 'theme_gunaj_green');
    	$description = get_string('headingcolordesc', 'theme_gunaj_green');
    	$default = '#27282a';
    	$previewconfig = null;
    	$setting = new admin_setting_configcolourpicker($name, $title, $description, $default, $previewconfig);
    	$setting->set_updatedcallback('theme_reset_all_caches');
    	$temp->add($setting);

    	// Header Background Image.
    	$name = 'theme_gunaj_green/headerbg';
    	$title = get_string('headerbg', 'theme_gunaj_green');
    	$description = get_string('headerbgdesc', 'theme_gunaj_green');
    	$setting = new admin_setting_configstoredfile($name, $title, $description, 'headerbg');
    	$setting->set_updatedcallback('theme_reset_all_caches');
    	$temp->add($setting);

   	$setting->set_updatedcallback('theme_reset_all_caches');
    	$temp->add($setting);

    $ADMIN->add('theme_gunaj_green', $temp);
	
	
	
    /* Banner Settings */
    $temp = new admin_settingpage('theme_gunaj_green_usermenu', get_string('usermenusettings', 'theme_gunaj_green'));
    $temp->add(new admin_setting_heading('theme_gunaj_green_usermenu', get_string('usermenusettingssub', 'theme_gunaj_green'),
    		format_text(get_string('usermenusettingsdesc' , 'theme_gunaj_green'), FORMAT_MARKDOWN)));

    /* Banner Settings */
    $temp = new admin_settingpage('theme_gunaj_green_banner', get_string('bannersettings', 'theme_gunaj_green'));
    $temp->add(new admin_setting_heading('theme_gunaj_green_banner', get_string('bannersettingssub', 'theme_gunaj_green'),
            format_text(get_string('bannersettingsdesc' , 'theme_gunaj_green'), FORMAT_MARKDOWN)));

    // Set Number of Slides.
    $name = 'theme_gunaj_green/slidenumber';
    $title = get_string('slidenumber' , 'theme_gunaj_green');
    $description = get_string('slidenumberdesc', 'theme_gunaj_green');
    $default = '1';
    $choices = array(
		'0'=>'0',
    	'1'=>'1',
    	'2'=>'2',
    	'3'=>'3',
    	'4'=>'4',
    	'5'=>'5',
    	'6'=>'6',
    	'7'=>'7',
    	'8'=>'8',
    	'9'=>'9',
    	'10'=>'10');
    $setting = new admin_setting_configselect($name, $title, $description, $default, $choices);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

    // Set the Slide Speed.
    $name = 'theme_gunaj_green/slidespeed';
    $title = get_string('slidespeed' , 'theme_gunaj_green');
    $description = get_string('slidespeeddesc', 'theme_gunaj_green');
    $default = '600';
    $setting = new admin_setting_configtext($name, $title, $description, $default );
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

    $config = theme_config::load('gunaj_green');
    $hasslidenum = (!empty($config->settings->slidenumber));
    if ($hasslidenum) {
            $slidenum = $config->settings->slidenumber;
    } else {
        $slidenum = '1';
    }

	$bannertitle = array('Slide One', 'Slide Two', 'Slide Three','Slide Four','Slide Five','Slide Six','Slide Seven', 'Slide Eight', 'Slide Nine', 'Slide Ten');

    foreach (range(1, $slidenum) as $bannernumber) {

    	// This is the descriptor for the Banner Settings.
    	$name = 'theme_gunaj_green/banner';
        $title = get_string('bannerindicator', 'theme_gunaj_green');
    	$information = get_string('bannerindicatordesc', 'theme_gunaj_green');
    	$setting = new admin_setting_heading($name.$bannernumber, $title.$bannernumber, $information);
    	$setting->set_updatedcallback('theme_reset_all_caches');
    	$temp->add($setting);

        // Enables the slide.
        $name = 'theme_gunaj_green/enablebanner' . $bannernumber;
        $title = get_string('enablebanner', 'theme_gunaj_green', $bannernumber);
        $description = get_string('enablebannerdesc', 'theme_gunaj_green', $bannernumber);
        $default = false;
        $setting = new admin_setting_configcheckbox($name, $title, $description, $default, true, false);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

        // Slide Title.
        $name = 'theme_gunaj_green/bannertitle' . $bannernumber;
        $title = get_string('bannertitle', 'theme_gunaj_green', $bannernumber);
        $description = get_string('bannertitledesc', 'theme_gunaj_green', $bannernumber);
        $default = $bannertitle[$bannernumber - 1];
        $setting = new admin_setting_configtext($name, $title, $description, $default );
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

        // Slide text.
        $name = 'theme_gunaj_green/bannertext' . $bannernumber;
        $title = get_string('bannertext', 'theme_gunaj_green', $bannernumber);
        $description = get_string('bannertextdesc', 'theme_gunaj_green', $bannernumber);
        $default = 'Bacon ipsum dolor sit amet turducken jerky beef ribeye boudin t-bone shank fatback pork loin pork short loin jowl flank meatloaf venison. Salami meatball sausage short loin beef ribs';
        $setting = new admin_setting_configtextarea($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

        // Text for Slide Link.
        $name = 'theme_gunaj_green/bannerlinktext' . $bannernumber;
        $title = get_string('bannerlinktext', 'theme_gunaj_green', $bannernumber);
        $description = get_string('bannerlinktextdesc', 'theme_gunaj_green', $bannernumber);
        $default = 'Read More';
        $setting = new admin_setting_configtext($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

        // Destination URL for Slide Link
        $name = 'theme_gunaj_green/bannerlinkurl' . $bannernumber;
        $title = get_string('bannerlinkurl', 'theme_gunaj_green', $bannernumber);
        $description = get_string('bannerlinkurldesc', 'theme_gunaj_green', $bannernumber);
        $default = '#';
        $previewconfig = null;
        $setting = new admin_setting_configtext($name, $title, $description, $default);
        $setting->set_updatedcallback('theme_reset_all_caches');
        $temp->add($setting);

        // Slide Image.
    	$name = 'theme_gunaj_green/bannerimage' . $bannernumber;
    	$title = get_string('bannerimage', 'theme_gunaj_green', $bannernumber);
    	$description = get_string('bannerimagedesc', 'theme_gunaj_green', $bannernumber);
    	$setting = new admin_setting_configstoredfile($name, $title, $description, 'bannerimage'.$bannernumber);
    	$setting->set_updatedcallback('theme_reset_all_caches');
    	$temp->add($setting);

    	// Slide Background Color.
    	$name = 'theme_gunaj_green/bannercolor' . $bannernumber;
    	$title = get_string('bannercolor', 'theme_gunaj_green', $bannernumber);
    	$description = get_string('bannercolordesc', 'theme_gunaj_green', $bannernumber);
    	$default = '#000';
    	$previewconfig = null;
    	$setting = new admin_setting_configcolourpicker($name, $title, $description, $default, $previewconfig);
    	$setting->set_updatedcallback('theme_reset_all_caches');
    	$temp->add($setting);

    }

    $ADMIN->add('theme_gunaj_green', $temp);
