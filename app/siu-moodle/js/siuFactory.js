app.factory('siuFactory', function($http,md5){
	var service = {};
	var _url = '';
	var _parametros = '';
	var _finalUrl = '';
	var _password = '';
	var _user = '';

	service.setUrl = function(url){
	_url = url;
	}

	service.setUser = function(user){
	_user = user;
	}

	service.setPassword = function(password){
	_password = password;
	}

	function setParametros(){
	_parametros = 
	{
	"username":_user,
	"password":_password,
	"url":_finalUrl
	};
	return _parametros;
	}

	service.getComisiones = function(){
	_finalUrl = _url + 'comisiones';
	return $http.post('wrapper.php',setParametros())
	};

	service.getCursos = function(){
	_finalUrl = _url + 'cursos';
	return $http.post('wrapper.php',setParametros())

	};

	service.getEstudiantes = function(){
	_finalUrl = _url + 'cursos';
	return $http.post('wrapper.php',setParametros())

	};

	service.getProfesores = function(){
	_finalUrl = _url + 'cursos';
	return $http.post('wrapper.php',setParametros())

	};

	return service;
});


