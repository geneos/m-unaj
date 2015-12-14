app.controller('siuMoodleCtrl', function($scope,$http,$q, $filter,PROPERTIES,ngTableParams,moodleFactory,siuFactory) {

	$scope.logArea = '';
	
	logInfo = function (text){
		//$scope.logArea = angular.element(document.querySelector('#logArea'));
		$scope.logArea = $scope.logArea + '[INFO] '+text+'\n';
	}

	logSuccess = function (text,caller,object){
		//$scope.logArea = angular.element(document.querySelector('#logArea'));
		$scope.logArea = $scope.logArea + '[SUCESS] '+text+'\n';
		console.log(caller+'.success',object);
	}
	
	logError = function (text,caller,object){
		//$scope.logArea = angular.element(document.querySelector('#logArea'));
		$scope.logArea = $scope.logArea + '[ERROR] '+text+'\n';
		console.log(caller+'.error',object);
	}

	$scope.logClear = function (){
		$scope.logText = '';
	}

	$scope.dataInitialized = false;
	$scope.selectedAll = false;
	$scope.moodleToken;
	$scope.siuUser;
	$scope.siuPassword;

	//Elementos de la tabla
	$scope.comisiones = [];

	//Cursos de moodle
	$scope.moodlecourses = [];

	//Categorias (Facultades) de moodle
	$scope.categoriasUnaj = [];

	$scope.initData = function(){
		logInfo('Comenzando la inicializacion de datos...');
		//Seteo configuracion Moodle Factory
		moodleFactory.setUrl(PROPERTIES.MOODLE_REST_URI);
		moodleFactory.setToken($scope.moodleToken);
		
		//Seteo configuracion de siuFactory
		siuFactory.setUrl(PROPERTIES.SIU_REST_URI);
		siuFactory.setUser($scope.siuUser);
		siuFactory.setPassword($scope.siuPassword);
		
		//requestQueue
		var requestPromise = [];

		//Mando a pedir comisiones y agrego a la cola de request
		var siuComisionesPromise = siuFactory.getComisiones();
		requestPromise.push(siuComisionesPromise);
		siuComisionesPromise
			.success(function(data) {
			    if (data.mensaje){
				logError('Error al intentar obtener comisiones de SIU: '+data.mensaje,'siuFactory.getComisiones',data);
			    }
			    else{
				    for (var i = 0; i < data.length; i++) {
					  //initialization of new property 
					  data[i].actividad_codigo = data[i].actividad.codigo;
					  data[i].actividad_nombre = data[i].actividad.nombre;
					  data[i].moodleCategoryID = null;
					  data[i].migrado = false;
					  data[i].checked = false;
					} 
				    $scope.comisiones = data;
				    logSuccess('Se obtuvieron ' +data.length+' comisiones de SIU','siuFactory.getComisiones',data);
				    delete data;
			    }
			}).error(function(data, status, header, config) {
			    logError('Error al intentar obtener comisiones de SIU','siuFactory.getComisiones',data);
			});


		//Mando a pedir cursos de moodle y agrego a la cola de request
		var moodleCursosPromise = moodleFactory.getCourses(null);
		requestPromise.push(moodleCursosPromise);
		moodleCursosPromise
			.success(function(data) {
			    if (data.exception) {
				console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
				logError('Error al intentar obtener cursos de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo);
			    }else{
				console.log('moodleFactory.getCursos',data);
				logSuccess('Se obtuvieron' +data.length+' cursos de Moodle');
				$scope.moodlecourses = data;
			    }
			}).error(function(data, status, header, config) {
			    if (status == -1)
				logError('Error al intentar obtener cursos de Moodle: Tiempo de espera agotado','moodleFactory.getCursos.error',data);
			    else
				logError('Error al intentar obtener cursos de Moodle','moodleFactory.getCursos',data);
			});
		
		//Mando a pedir categoria por id de categoria padre (Categoria donde se encuentran las sub categorias facultades)
		var moodleCategoriesPromise = moodleFactory.getCategoriesByParent(PROPERTIES.MOODLE_ROOT_CATEGORY_ID);
		requestPromise.push(moodleCategoriesPromise);		
		moodleCategoriesPromise
			.success(function(data) {
			    if (data.exception)
				logError('Error al intentar obtener categorias de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,data);
			    else{
				logSuccess('Se obtuvieron' +data.length+' categorias de Moodle','moodleFactory.getCategoriesByParent',data);
				$scope.categoriasUnaj = data;		
			    }
			}).error(function(data, status, header, config) {
				if (status == -1)
				logError('Error al intentar obtener categorias de Moodle: Tiempo de espera agotado','moodleFactory.getCategoriesByParent',data);
			    else
				logError('Error al intentar obtener categorias de Moodle','moodleFactory.getCategoriesByParent',data);
			});
	
		//Control de sincronizacion por obtencion de cursos, comisiones y categorias
		$q.all(requestPromise).then(function(data) {
			console.log('Se obtuvieros cursos (moodle), categorias (moodle) y comisiones(siu) correctamente');
			//Ahora ya puedo setear si un curso esta migrado o no				
			for (var i = 0; i < $scope.comisiones.length; i++) {
				$scope.comisiones[i].migrado =  $filter('comisionMigrated')($scope.comisiones[i].actividad_codigo,$scope.moodlecourses);
				$scope.comisiones[i].moodleCategoryID =  getMoodleCategoryID($scope.comisiones[i].actividad_codigo);
			} 
			$scope.tableParams.reload();
			
			$scope.dataInitialized = true;
			logInfo('Se Inicializaron los datos correctamente');
		});
	}

	//Crear Curso
	$scope.importCourse = function (siuComision,categoria){
		console.log('importCourse',siuComision);
		moodleFactory.createCourse(siuComision.actividad.nombre,siuComision.actividad.codigo,siuComision.moodleCategoryID).
		success(function(data) {
		    if (data.exception)
			console.log('importCourse.createCourse.Error'+data.exception + '\n'+data.message +'\n'+data.debuginfo);
		    else{
			console.log('importCourse.createCourse',data[0]);
			//Sincronizo con SIU (Agrego curso)
			siuFactory.createCourse(data[0].id,data[0].shortname)
				.success(function(data) {
				    console.log('importCourse.createCourse',data);
				    $scope.moodlecourses.push(data[0].curso);
				}).error(function(data) {
					console.log('importCourse.createCourse.error',data);
				});			
		    }
		}).error(function(data) {
		     console.log('importCourse.Error',data);
		});
	};


	var getMoodleCategoryID = function (shortname) {
		console.log(shortname);
		for(var i = 0; i<$scope.moodlecourses.length; i++){
			if ($scope.moodlecourses[i].shortname == shortname)	
				return 	$scope.moodlecourses[i].categoryid;
		}
		return null;
	};

	//Funcion que refresca datos de la ngTable manteniento filtros y ordenamiento
	var resetTableParams = function(){
	    return {
		total: $scope.comisiones.length,
		getData: function($defer, params) {
		    var filteredData = params.filter() ? $filter('filter')($scope.comisiones,    params.filter()) : $scope.comisiones;
		    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

		    params.total(orderedData.length);
		    data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count());
		    $defer.resolve(data); 
		    console.log(data);
		          
		}
	    }
	}
	
	//Inicializo Table Params
	$scope.tableParams = new ngTableParams({}, resetTableParams());
	console.log($scope.tableParams);

	

	$scope.checkAll = function () {
		if ($scope.selectedAll) {
		    $scope.selectedAll = true;
		} else {
		    $scope.selectedAll = false;
		}
		angular.forEach($scope.tableParams.data, function (comision) {
		    comision.selected = $scope.selectedAll;
		});

	};

	
		
		
});
