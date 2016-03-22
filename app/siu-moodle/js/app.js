var app = angular.module('siuMoodleApp', ['ngTable'],function($httpProvider) {
	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	//$httpProvider.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	/**
	* The workhorse; converts an object to x-www-form-urlencoded serialization.
	* @param {Object} obj
	* @return {String}
	*/ 
	var param = function(obj) {
		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

		for(name in obj) {
		value = obj[name];

		if(value instanceof Array) {
		for(i=0; i<value.length; ++i) {
		  subValue = value[i];
		  fullSubName = name + '[' + i + ']';
		  innerObj = {};
		  innerObj[fullSubName] = subValue;
		  query += param(innerObj) + '&';
		}
		}
		else if(value instanceof Object) {
		for(subName in value) {
		  subValue = value[subName];
		  fullSubName = name + '[' + subName + ']';
		  innerObj = {};
		  innerObj[fullSubName] = subValue;
		  query += param(innerObj) + '&';
		}
		}
		else if(value !== undefined && value !== null)
		query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}

		return query.length ? query.substr(0, query.length - 1) : query;
	};

	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function(data) {
	return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];

	});


	app.filter('estudianteMigrated', function($filter) {
		return function(estudianteSiu,comisionSiu,cursosMoodle,actividad,periodo) {
			for (var i = 0; i<cursosMoodle.length ; i++){
				if ($filter('actividadEquals')(actividad,cursosMoodle[i].shortname,periodo) && cursosMoodle[i].comisiones){
					for (var j = 0; j<cursosMoodle[i].comisiones.length ; j++){
						if (comisionSiu == cursosMoodle[i].comisiones[j].name ){
							console.log(cursosMoodle[i].comisiones[j]);
							if (cursosMoodle[i].comisiones[j].estudiantes){
								for (var h = 0; h<cursosMoodle[i].comisiones[j].estudiantes.length ; h++){
									if (estudianteSiu.usuario.toLowerCase() == cursosMoodle[i].comisiones[j].estudiantes[h].username)
										return true;
								}

							}
						return false;
						}
					}	
				}
			};
			return false;
		};
	});

	app.filter('docenteMigrated', function($filter) {
		return function(docenteSiu,comisionSiu,cursosMoodle,actividad,periodo) {
			for (var i = 0; i<cursosMoodle.length ; i++){
				if ($filter('actividadEquals')(actividad,cursosMoodle[i].shortname,periodo) && cursosMoodle[i].comisiones){
					for (var j = 0; j<cursosMoodle[i].comisiones.length ; j++){
						if (comisionSiu == cursosMoodle[i].comisiones[j].name ){
							if (cursosMoodle[i].comisiones[j].docentes){
								for (var h = 0; h<cursosMoodle[i].comisiones[j].docentes.length ; h++){
									if (docenteSiu.usuario.toLowerCase() == cursosMoodle[i].comisiones[j].docentes[h].username)
										return true;
								}

							}
						return false;
						}
					}	
				}
			};
			return false;
		};
	});

	app.filter('isDocente', function($filter) {
		return function(username,comision,actividades,moodleCourseShortName,periodo) {
			for (var i = 0; i<actividades.length ; i++){
				if ($filter('actividadEquals')(actividades[i].codigo,moodleCourseShortName,periodo) && actividades[i].comisiones){
					for (var j = 0; j<actividades[i].comisiones.length ; j++){
						if (comision == actividades[i].comisiones[j].nombre && actividades[i].comisiones[j].docentes){
							for (var h = 0; h<actividades[i].comisiones[j].docentes.length ; h++){
								if (username == actividades[i].comisiones[j].docentes[h].docente.usuario.toLowerCase())
									return true;
							}
						return false;
						}
					}	
				}
			};
			return false;
		};
	});

	app.filter('sincronizado', function($filter) {
		return function(comisionSiu,comisionMoodle) {
			if ( (!comisionSiu.alumnos && comisionMoodle.estudiantes) 
					|| (comisionSiu.alumnos && !comisionMoodle.estudiantes)
					|| comisionSiu.alumnos.length != comisionMoodle.estudiantes.length)
				return false;

			if (comisionSiu.docentes.length != comisionMoodle.docentes.length)
				return false;

			//Docentes
			for(i = 0 ; i < comisionSiu.docentes.length ; i++){
				var exist = false;
				for(j = 0 ; j < comisionMoodle.docentes.length ; j++)
					if ( comisionMoodle.docentes[j].username == comisionSiu.docentes[i].usuario.toLowerCase() ){
						exist = true;
						break;
					}
				if (!exist)
					return false
			}

			//Alumnos
			for(i = 0 ; i < comisionSiu.alumnos.length ; i++){
				var exist = false;
				for(j = 0 ; j < comisionMoodle.estudiantes.length ; j++)
					if ( comisionSiu.alumnos[i].usuario.toLowerCase() == comisionMoodle.estudiantes[j].username ) {
						exist = true;
						break;
					}
				if (!exist)
					return false
			}

			return true;
		};
	});


	app.filter('userExistInMoodle', function() {
		return function(estudianteSiu,usuariosMoodle) {
			for (var i = 0; i<usuariosMoodle.length ; i++){
				if (usuariosMoodle[i].username == estudianteSiu.usuario.toLowerCase()){
					return true;
				}
			};
			return false;
		};
	});


	app.filter('comisionMigrated', function($filter) {
		return function(comision,cursosMoodle,actividad,periodo) {
			for (var i = 0; i<cursosMoodle.length ; i++){
				if ( $filter('actividadEquals')(actividad,cursosMoodle[i].shortname,periodo) &&  cursosMoodle[i].comisiones){
					for (var j = 0; j<cursosMoodle[i].comisiones.length ; j++){
						if (comision == cursosMoodle[i].comisiones[j].name)
							return true;
					}
				}	
			}
			return false;
		};
	});

	app.filter('actividadEquals', function(PROPERTIES) {

		return function(actividadSiu,actividadMoodle,periodo) {
			if (PROPERTIES.MOODLE_COURSE_SHORTNAME_PREFIX+actividadSiu+'-'+periodo.periodo_lectivo == actividadMoodle)
				return true;
			return false;
		};
	});

	app.filter('actividadMigrated', function($filter) {
		return function(actividad,cursosMoodle,periodo) {
			for (var i = 0; i<cursosMoodle.length ; i++){
				if ($filter('actividadEquals')(actividad,cursosMoodle[i].shortname,periodo)){
					return true;
				}
			}
			return false;
		};
	});