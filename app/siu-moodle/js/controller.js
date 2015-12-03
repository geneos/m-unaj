app.controller('siuMoodleCtrl', function($scope,$http,$q, $filter,ngTableParams,moodleFactory,siuFactory) {

	var restMoodleUrl = 'http://192.168.0.31/moodle/webservice/rest/server.php';
	var token = 'a12c275aa605147602b867b1d6f8f010';
	//Seteo configuracion Moodle Factory
	moodleFactory.setUrl(restMoodleUrl);
	moodleFactory.setToken(token);


	//Obtener categoria por nombre
	getMoodleCategories = function (catName){
		moodleFactory.getCategories(catName).
		success(function(data) {
		    if (data.exception)
			alert(data.exception +'\n'+data.debuginfo)
		    else
			alert(data);
		});
	};

	//Crear Curso
	$scope.createCourse = function (siuComision){
		console.log(siuComision);
		moodleFactory.createCourse(siuComision.actividad.nombre,siuComision.actividad.codigo,4).
		success(function(data) {
		    if (data.exception)
			console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
		    else{
			console.log('Curso creado en moodle',data[0]);
			moodleFactory.getCourses([data[0].id])
				.success(function(data) {
				    if (data.exception)
					console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
				    else{
					console.log('moodleFactory.getCursos.success',data);
					$scope.moodlecourses.push(data[0]);
				    }
				}).error(function(data) {
					console.log('moodleFactory.getCursos.error',data);
				});
			
		    }
		});
	};

	//Inicializo dataset de tableParams
	$scope.comisiones = [];
	//$scope.tableParams = new ngTableParams();

	//Seteo configuracion de siuFactory
	var restSiuUrl = 'http://170.210.158.23/guarani/3.10/rest/';
	siuFactory.setUrl(restSiuUrl);
	siuFactory.setUser('guarani');
	siuFactory.setPassword('guarani');

	//requestQueue
	var requestPromise = [];

	//Obtener comisiones y las coloco en el dataset de tableParams
	var siuComisionesPromise = siuFactory.getComisiones();
	requestPromise.push(siuComisionesPromise);
	siuComisionesPromise
		.success(function(data) {
		    console.log('siuFactory.getComisiones.success',data);
		    for (var i = 0; i < data.length; i++) {
			  //initialization of new property 
			  data[i].actividad_codigo = data[i].actividad.codigo;
			  data[i].actividad_nombre = data[i].actividad.nombre;
			  data[i].migrado = false;
			} 
		    $scope.comisiones = data;
		    delete data;
		}).error(function(data) {
		    console.log('siuFactory.getComisiones.error',data);
		});


	//Obtengo cursos de moodle
	$scope.moodlecourses = [];
	var moodleCursosPromise = moodleFactory.getCourses(null);
	requestPromise.push(moodleCursosPromise);
	moodleCursosPromise
		.success(function(data) {
		    if (data.exception)
			console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
		    else{
			console.log('moodleFactory.getCursos.success',data);
			$scope.moodlecourses = data;
		    }
		}).error(function(data) {
		console.log('moodleFactory.getCursos.error',data);
		});

	
	//Control de sincronizacion por obtencion de cursos y comisiones
	$q.all(requestPromise).then(function(data) {
		console.log('Se obtuvieros cursos (moodle) y comisiones(siu) correctamente',data);
		//Ahora ya puedo setear si un curso esta migrado o no				
		for (var i = 0; i < $scope.comisiones.length; i++) {
			$scope.comisiones[i].migrado =  $filter('comisionMigrated')($scope.comisiones[i].actividad_codigo,$scope.moodlecourses);
		} 
		$scope.tableParams = new ngTableParams({}, { dataset: $scope.comisiones});

	});

	$scope.checkAll = function () {
		if ($scope.selectedAll) {
		    $scope.selectedAll = true;
		} else {
		    $scope.selectedAll = false;
		}
		angular.forEach($scope.comisiones, function (comision) {
		    comision.Selected = $scope.selectedAll;
		});

	};			
		
});
