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
 * External Web Service Template
 *
 * @package    localwstemplate
 * @copyright  2011 Moodle Pty Ltd (http://moodle.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once($CFG->libdir . "/externallib.php");
require_once($CFG->libdir . "/accesslib.php");

class local_get_groupmembers_external extends external_api {
 
    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     * @since Moodle 2.2
     */
    public static function get_group_members_parameters() {
        return new external_function_parameters(
            array(
                'groupids' => new external_multiple_structure(new external_value(PARAM_INT, 'Group ID')),
            )
        );
    }

    /**
     * Return all members for a group
     *
     * @param array $groupids array of group ids
     * @return array with  group id keys containing arrays of user ids
     * @since Moodle 2.2
     */
    public static function get_group_members($groupids) {
        $members = array();

        $params = self::validate_parameters(self::get_group_members_parameters(), array('groupids'=>$groupids));

        foreach ($params['groupids'] as $groupid) {
            // validate params
            $group = groups_get_group($groupid, 'id, courseid, name, enrolmentkey', MUST_EXIST);
            // now security checks
            $context = context_course::instance($group->courseid, IGNORE_MISSING);
            try {
                self::validate_context($context);
            } catch (Exception $e) {
                $exceptionparam = new stdClass();
                $exceptionparam->message = $e->getMessage();
                $exceptionparam->courseid = $group->courseid;
                throw new moodle_exception('errorcoursecontextnotvalid' , 'webservice', '', $exceptionparam);
            }
            require_capability('moodle/course:managegroups', $context);

            $groupmembers = groups_get_members($group->id, 'u.id,u.email,u.username', 'lastname ASC, firstname ASC');

            $context = get_context_instance(CONTEXT_COURSE,$group->courseid);


            $membersaux = array();



            foreach($groupmembers as $member){
              //get_user_roles($context, $member->id);
              $member->{"role"} = 0;
              if (user_has_role_assignment($member->id, 5, $context->id) )
                $member->{"role"} = 5;//Student;
              if (user_has_role_assignment($member->id, 3, $context->id) )
                $member->{"role"} = 3;//Teacher
              $membersaux[] = $member;
            }

            $members[] = array('groupid'=>$groupid,'groupname'=>$group->name, 'users'=>$membersaux);
        }

        return $members;
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.2
     */
    public static function get_group_members_returns() {
        return new external_multiple_structure(
            new external_single_structure(
                array(
                    'groupid' => new external_value(PARAM_INT, 'group record id'),
                    'groupname' => new external_value(PARAM_TEXT, 'group name'),
                    'users' => new external_multiple_structure(
                                    new external_single_structure (
                                        array (
                                                'id' => new external_value(PARAM_INT, 'user id'),
                                                'email' => new external_value(PARAM_TEXT, 'email'),
                                                'username' => new external_value(PARAM_TEXT, 'username'),
                                                'role' => new external_value(PARAM_INT, 'role')
                                            )

                                        )       

                                    ),
                )
            )
        );
    }

}
