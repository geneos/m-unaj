app.factory('siuFactory', function($http,PROPERTIES){
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

	function setLimit(limit,page){
	_finalUrl = _finalUrl + '?limit='+limit+'&page='+page
	}

	function setFinalUrl(path){
	_finalUrl = _url + path;
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
	setFinalUrl('comisiones');
	return $http.post('wrapper.php',setParametros())
	};

	service.getAllComisiones = function(limit,page){
	setFinalUrl('comisiones');
	setLimit(limit,page);
	return $http.post('wrapper.php',setParametros())
	};

	service.getCursos = function(){
	setFinalUrl('cursos');
	return $http.post('wrapper.php',setParametros())

	};

	//Agrego prefijo PREFIX como para poder saber cuales son de moodle
	service.createCurso = function(id,codigo){
	_finalUrl = _url + 'cursos/'+PROPERTIES.PREFIX+id;
	setParametros().parameters = {"curso": PROPERTIES.PREFIX+id,"nombre":PROPERTIES.CURRENT_YEAR+'-'+codigo};
	return $http.post('put.php',_parametros)

	};

	service.addComisionCurso = function(id,idcomision){
	_finalUrl = _url + 'cursos/M-'+id+'/comisiones/'+idcomision;
	setParametros();
	return $http.post('put.php',_parametros)

	};


	service.getAlumnos = function(idcomision){
	setFinalUrl('comisiones/'+idcomision+'/alumnos');
	//setInfiniteLimit();
	//Agrego este parametro solo para saber la comision en el callback
	setParametros().comision = idcomision;
	return $http.post('wrapper.php',_parametros)

	};

	service.getDocentes = function(idcomision){
	setFinalUrl('comisiones/'+idcomision+'/docentes');
	//setInfiniteLimit();
	//Agrego este parametro solo para saber la comision en el callback
	setParametros().comision = idcomision;
	return $http.post('wrapper.php',_parametros)

	};

	return service;
});


