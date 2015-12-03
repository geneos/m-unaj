app.factory('moodleFactory', function($http){
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


	service.createCourse = function(fullname,shortname,category){
	_function = "core_course_create_courses";
	setParametros().courses = [{"fullname":fullname,"shortname":shortname,"categoryid":category,"visible":1}];
	return $http.post(_url,_parametros);
	};

	service.getCategories = function(name){
	_function = "core_course_get_categories";
	setParametros().criteria= [{"key":"name","value":name}];
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
