//Se importa el año/cuatrimestre de la materia. 
//Las comisiones se sincronizan: Creo grupo, agrego usuarios. Elimino usuarios que ya no estan en siu

//Mapeo en memoria de usuario moodle / usuario siu

//Codificacion para detectar curso de moodle segun materia/cuatrimestre/año MAT-1-2015 (Matematica primer cuatrimestre 2015)
app.factory('moodleFactory', function($http,PROPERTIES){
	var service = {};
	var _url = '';
	var _parametros = '';
	var _function = '';
	var _token = '';

	service.setUrl = function(url){
	_url = url;
	}

	service.setToken = function(token){
	_token = token;
	}

	function setParametros(){
	_parametros = 
	{
	"wstoken":_token,
	"wsfunction":_function,
	"moodlewsrestformat":"json"
	};
	return _parametros;
	}

	/*
		Crea un curso dentro de la plataforma moodle.
		- Se agrega como prefijo PREFIX definido en properties y se agrega como sufijo el periodo lectivo ya que debe existir un curso por año dada una actividad
		- El curso se agrega siempre a la categoria "importados" dentro de el instituto que corresponda
		- Se crean en el formato de temas
		- Se agrega como descripcion el nombre del periodo lectivo.
	*/
	service.createCourse = function(fullname,shortname,category,periodo){
	_function = "core_course_create_courses";
	setParametros().courses = [{"fullname":fullname,"shortname":PROPERTIES.MOODLE_COURSE_SHORTNAME_PREFIX+shortname+'-'+periodo.periodo_lectivo,"categoryid":category,"visible":0,"format":"topics","summary":periodo.nombre}];
	return $http.post(_url,_parametros);
	};

	/*
		Matricula un usuario {userid} con el rol {roleid} en el curso {courseid}
	*/
	function enrolUser (roleid,userid,courseid){
	_function = "enrol_manual_enrol_users";
	setParametros().enrolments = [{"roleid":roleid,"userid":userid,"courseid":courseid}];
	return $http.post(_url,_parametros);
	};

	/*
		Matricula un usuario {userid} con el rol estudiante en el curso {courseid}
	*/
	service.enrolStudent = function(userid,courseid){
	return enrolUser(PROPERTIES.MOODLE_STUDENT_ROLE_ID,userid,courseid);
	};

	/*
		Matricula un usuario {userid} con el rol profesor en el curso {courseid}
	*/
	service.enrolTeaching = function(userid,courseid){
	return enrolUser(PROPERTIES.MOODLE_TEACHING_ROLE_ID,userid,courseid);
	};


	/*
		Desmatricula un usuario {userid} del curso {courseid}
	*/
	service.unenrolUser = function (userid,courseid){
	_function = "enrol_manual_unenrol_users";
	setParametros().enrolments = [{"userid":userid,"courseid":courseid}];
	return $http.post(_url,_parametros);
	};

	service.createGroupForCourseFunctionName = function(){
		return "core_group_create_groups";
	};

	/*
		Crea un grupo para un determinado curso
	*/
	service.createGroupForCourse = function(courseid,name){
	_function = service.createGroupForCourseFunctionName();//"core_group_create_groups";
	setParametros().groups = [{"courseid":courseid,"name":name,"description":" ","descriptionformat":1}];
	return $http.post(_url,_parametros);
	};


	service.deleteGroupFunctionName = function(){
		return "core_group_delete_groups";
	};

	/*
		Borra un grupo 
	*/
	service.deleteGroup = function(groupid){
	_function = service.deleteGroupFunctionName();//"core_group_delete_groups";
	setParametros().groupids = [groupid];
	return $http.post(_url,_parametros);
	};

	service.getUsers = function(){
	_function = "core_user_get_users";
	setParametros().criteria = [{"key":"mail","value":"%%"}];
	return $http.post(_url,_parametros);
	};
	

	/*
		Crea un usuario
	*/
	service.createUser = function(username,password,firstname,lastname,email){
	_function = "core_user_create_users";
	if (email.length == 0 || !email.trim())
		//Si no tiene mail entonces le asigno un mail por defecto
		email = username+PROPERTIES.CREATE_USER_MOODLE_EMAIL_DEFAULT
	setParametros().users = [{"username":username,"password":password,"firstname":firstname,"lastname":lastname,"email":email}];
	return $http.post(_url,_parametros);
	};


	service.getCourseGroups = function(courseID){
	_function = "core_group_get_course_groups";
	setParametros().courseid = courseID;
	return $http.post(_url,_parametros);
	};

	service.addGroupMember = function(groupid,userid){
	_function = "core_group_add_group_members";
	setParametros().members = [{"groupid":groupid,"userid":userid}];
	return $http.post(_url,_parametros);
	}

	service.getGroupsMembers = function(groupsid){
	_function = "local_myplugin_get_group_members";
	setParametros().groupids = groupsid;
	return $http.post(_url,_parametros);
	};

	service.getCategories = function(name){
	_function = "core_course_get_categories";
	setParametros().criteria= [{"key":"name","value":name}];
	return $http.post(_url,_parametros);
	};

	service.getCategoriesByParent = function(parent,subcategories){
	var value = "1";
	if (!subcategories)
		value = "0";
	_function = "core_course_get_categories";
	setParametros().criteria = [{"key":"parent","value":parent}];
	_parametros.addsubcategories = value;
	return $http.post(_url,_parametros);
	};

	service.getCourses = function(ids){
	if (ids == null)
		ids = [];
	_function = "core_course_get_courses";
	var idsParams = {'ids':ids};
	setParametros().options= {"ids":ids};
	return $http.post(_url,_parametros);
	};

	return service;
});

