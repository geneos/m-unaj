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
 * gunaj theme for the underlying Elegance theme.
 *
 * @package    theme
 * @subpackage gunaj
 * @author	   Cooperativa GENEOS
 * @author     Based on code originally written by G J Barnard, Mary Evans, Bas Brands, Stuart Lamour and David Scotson.
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

$plugin->version   = 2018071600;
$plugin->release = '2.0 (Build: 20170719)';
$plugin->maturity = MATURITY_STABLE;             // this version's maturity level.
$plugin->requires  = 2013110500;
$plugin->component = 'theme_gunaj';
$plugin->dependencies = array(
    'theme_elegance' => 2014011600,
);
