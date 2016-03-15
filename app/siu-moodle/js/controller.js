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
	$scope.periodosInitialized = false;


	$scope.selectedAll = false;
	$scope.moodleToken = '904c4c7981d381dba82c37c4bad03353';
	$scope.siuUser = 'guarani';
	$scope.siuPassword = 'guarani';


	//Elementos de la tabla
	$scope.actividades = [];

	//Periodos Lectivos SIU
	$scope.periodosLectivos = [];

	//Comisiones SIU
	$scope.comisiones = [];

	//Cursos SIU
	$scope.cursosSiu = [];

	//Cursos de moodle
	$scope.moodlecourses = [];

	//Grupos de moodle
	$scope.moodlegroups = [];

	//Usuarios de moodle
	$scope.moodleusers = [];

	//Categorias (Institutos) de moodle
	$scope.categoriasUnaj = [];

	//Categorias donde van cada curso dentro de los institutos
	$scope.subCategoriasUnaj = [];

	//TEST CATEGORIA IMPORTADOS
	$scope.testCategoriaImportar = function(){
		moodleFactory.getCategoriesImportCategory(5)
		.success(function(data) {
		    if (data.exception) {
			console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
			logError('Error al intentar crear grupo:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.createGroupForCourse',data);
		    }else{
			logSuccess('Se creo grupo' +data+' de Moodle');
		    }
		}).error(function(data, status, header, config) {
		    if (status == -1)
			logError('Error al intentar crear grupo moodle: Tiempo de espera agotado','moodleFactory.createGroupForCourse.error',data);
		    else
			logError('Error al intentar crear grupo moodle','moodleFactory.createGroupForCourse',data);
		});
	}

	//TEST DE CREAR GRUPO
	$scope.testGrupo = function(){
		logInfo('Comenzando creado de grupo...');
		moodleFactory.createGroupForCourse(2,"Comision 1")
		.success(function(data) {
		    if (data.exception) {
			console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
			logError('Error al intentar crear grupo:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.createGroupForCourse',data);
		    }else{
		    	console.log(data);
			logSuccess('Se creo grupo' +data+' de Moodle');
		    }
		}).error(function(data, status, header, config) {
		    if (status == -1)
			logError('Error al intentar crear grupo moodle: Tiempo de espera agotado','moodleFactory.createGroupForCourse.error',data);
		    else
			logError('Error al intentar crear grupo moodle','moodleFactory.createGroupForCourse',data);
		});
	}

	//TEST DE CREAR USUARIO
	$scope.testUser = function(){
		logInfo('Comenzando creado de usuario...');
		moodleFactory.createUser("123456","@1B2c3D4","test","test2","test@testaso.com")
		.success(function(data) {
		    if (data.exception) {
			console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
			logError('Error al intentar crear user:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.createGroupForCourse',data);
		    }else{
			logSuccess('Se creo user' +data+' de Moodle');
		    }
		}).error(function(data, status, header, config) {
		    if (status == -1)
				logError('Error al intentar user grupo moodle: Tiempo de espera agotado','moodleFactory.createGroupForCourse.error',data);
		    else
				logError('Error al intentar user grupo moodle','moodleFactory.createGroupForCourse',data);
		});
	}

	//TEST DE MATRICULAR ESTUDIANTE
	$scope.testEnrol = function(){
		logInfo('Comenzando creado de usuario...');
		moodleFactory.enrolUser(5,4,2)
		.success(function(data) {
		    if (data && data.exception) {
			console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
			logError('Error al intentar enrole user:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.createGroupForCourse',data);
		    }else{
			logSuccess('Se creo enrol' +data+' de Moodle');
		    }
		}).error(function(data, status, header, config) {
		    if (status == -1)
			logError('Error al intentar user grupo moodle: Tiempo de espera agotado','moodleFactory.createGroupForCourse.error',data);
		    else
			logError('Error al intentar user grupo moodle','moodleFactory.createGroupForCourse',data);
		});
	}

	//TEST DE ASIGNAR USUARIO A GRUPO
	$scope.testAddMember = function(){
		logInfo('Comenzando asignacion de comision...');
		moodleFactory.addGroupMember(3,4)
		.success(function(data) {
		    if (data && data.exception) {
			console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
			logError('Error al intentar add group memeber:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.createGroupForCourse',data);
		    }else{
			logSuccess('Se creo add group' +data+' de Moodle');
		    }
		}).error(function(data, status, header, config) {
		    if (status == -1)
			logError('Error al intentar user grupo moodle: Tiempo de espera agotado','moodleFactory.createGroupForCourse.error',data);
		    else
			logError('Error al intentar user grupo moodle','moodleFactory.createGroupForCourse',data);
		});
	}


	$scope.preInitData = function(){

		//Seteo configuracion de siuFactory
		siuFactory.setUrl(PROPERTIES.SIU_REST_URI);
		siuFactory.setUser($scope.siuUser);
		siuFactory.setPassword($scope.siuPassword);

		siuFactory.getAllComisiones()
			.success(function(data) {
			    if (data.mensaje){
					logError('Error al intentar obtener comisiones de SIU: '+data.mensaje,'siuFactory.getComisiones',data);
			    }
			    else {
			    	var periodosCount = 0;
			    	indexedPeriodos = [];
					angular.forEach(data,function (comision){
						if (filterPeriodos(comision)) {
							$scope.periodosLectivos.push(comision.periodo_lectivo);
						}
					});

					$scope.comisiones = data; 
					logSuccess('Se obtuvieron ' +$scope.comisiones.length+' Comisiones de SIU ','siuFactory.getComisiones',$scope.comisiones);
				    logSuccess('Se obtuvieron ' +$scope.periodosLectivos.length+' Periodos Lectivos de SIU ','siuFactory.getComisiones',$scope.periodosLectivos);
				    $scope.periodosInitialized = true;

				}
			}).error(function(data, status, header, config) {
			    logError('Error al intentar obtener comisiones de SIU','siuFactory.getComisiones',data);
			});
	}



	$scope.initData = function(){
		logInfo('Comenzando la inicializacion de datos...');
		//Seteo configuracion Moodle Factory
		moodleFactory.setUrl(PROPERTIES.MOODLE_REST_URI);
		moodleFactory.setToken($scope.moodleToken);
		
		//Seteo configuracion de siuFactory
		/*siuFactory.setUrl(PROPERTIES.SIU_REST_URI);
		siuFactory.setUser($scope.siuUser);
		siuFactory.setPassword($scope.siuPassword);*/
		
		//requestQueue
		var requestPromise = [];


		//Mando a pedir usuarios de moodle
		var moodleUsersPromise = moodleFactory.getUsers();
		requestPromise.push(moodleUsersPromise);	
		moodleUsersPromise
			.success(function (data) {
					if(!data.exception){
						console.log('TODOS LOS USUARIOS',data);
						$scope.moodleusers =  data.users;
						logInfo('Se obtuvieron '+data.users.length + ' usuarios de moodle')
					}
					else
						logError('Error al intentar obtener usuarios de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.getUsers',data);
				})
				.error(function (error){
					logError('Error al intentar obtener usuarios de moodle','moodleFactory.getUsers',data);
				});

		//Mando a pedir comisiones (Ordenadas por actividad) y agrego a la cola de request
		/*var siuComisionesPromise = siuFactory.getComisiones();
		requestPromise.push(siuComisionesPromise);
		siuComisionesPromise
			.success(function(data) {
			    if (data.mensaje){
					logError('Error al intentar obtener comisiones de SIU: '+data.mensaje,'siuFactory.getComisiones',data);
			    }
			    else {*/


			    	
			    	//$scope.comisiones = $filter('filter')($scope.comisiones,    params.filter());

    	//Filtro por periodo
		var comisionesFiltered = $scope.comisiones.filter(function (comision) {
		    return (comision.periodo_lectivo.periodo_lectivo == $scope.periodoSelected);
		});


		//Reseteo actividades
    	var actividadesCount = 0;
    	indexedActivities = [];
    	$scope.actividades = []


	    for (var i = 0; i < comisionesFiltered.length; i++) {
		  	//Agrupo en actividades (las comisiones vienen ordenadas por actividad)
			if (filterActividades(comisionesFiltered[i])){
			  	$scope.actividades.push({ 	
			  							'codigo': comisionesFiltered[i].actividad.codigo,
			  							'nombre': comisionesFiltered[i].actividad.nombre,
			  							'comisiones':[],
			  							'checked':false,
			  							'moodleCategoryID':null,
			  							'migrado':false,
			  							'curso':0,
			  							'codError':0,
			  							'$hideRows':true
			  							});
			  	actividadesCount++;
		  	}
  		$scope.actividades[actividadesCount-1].comisiones.push(comisionesFiltered[i]);
		
		}


	    //Itero sobre todos las actividades y obtengo los docentes
	    var docentesPromise = [];
		angular.forEach($scope.actividades, function (actividad) {
			console.log('Voy a obtener Docentes');
			angular.forEach(actividad.comisiones, function (comision) {
				docentesPromise.push (siuFactory.getDocentes(comision.comision));
			});
		    
		});	

		//Itero sobre todos las actividades y obtengo los estudiantes
	    var estudiantesPromise = [];
		angular.forEach($scope.actividades, function (actividad) {
			console.log('Voy a obtener Alumnos');
			angular.forEach(actividad.comisiones, function (comision) {
				estudiantesPromise.push (siuFactory.getAlumnos(comision.comision));
			});
		    
		});	
		$q.all(docentesPromise).then(function(data) {
			console.log('Docentes!!',data);
			for (i=0 ; i<data.length ; i++){
				if (data[i].data.length > 0)
					addProfesorsToComision(data[i].data,data[i].config.data.comision);
			}
		});

		$q.all(estudiantesPromise).then(function(data) {
			console.log('Estudiantes!!',data);
			for (i=0 ; i<data.length ; i++){
				if (data[i].data.length > 0)
					addStudentsToComision(data[i].data,data[i].config.data.comision);
			}
		});

			    /*}
			}).error(function(data, status, header, config) {
			    logError('Error al intentar obtener comisiones de SIU','siuFactory.getComisiones',data);
			});*/
		

		//Mando a pedir cursos de siu y agrego a la cola de request
		var siuCursosPromise = siuFactory.getCursos();
		console.log('Hola1!!');
		requestPromise.push(siuCursosPromise);
		siuCursosPromise
			.success(function(data) {
			    if (data.mensaje){
					logError('Error al intentar obtener cursos de SIU: '+data.mensaje,'siuFactory.getCursos',data);
			    }
			    else{
				    $scope.cursosSiu = data;
				    logSuccess('Se obtuvieron ' +data.length+' cursos de SIU','siuFactory.getCursos',data);
				    delete data;
			    }
			}).error(function(data, status, header, config) {
			    logError('Error al intentar obtener cursos de SIU','siuFactory.getCursos',data);
			});


		//Mando a pedir categoria por id de categoria padre (Categoria donde se encuentran las sub categorias facultades)
		var moodleCategoriesPromise = moodleFactory.getCategoriesByParent(PROPERTIES.MOODLE_ROOT_CATEGORY_ID);
		console.log('Hola2!!');
		requestPromise.push(moodleCategoriesPromise);		
		moodleCategoriesPromise
			.success(function(data) {
			    if (data.exception)
					logError('Error al intentar obtener categorias de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.getCategoriesByParent',data);
			    else{
					logSuccess('Se obtuvieron' +data.length+' categorias de Moodle','moodleFactory.getCategoriesByParent',data);
					$scope.categoriasUnaj = data;		

					//Itero sobre todos las categorias y obtengo las categorias "importados"
				    var catImportadosPromise = [];
					angular.forEach($scope.categoriasUnaj, function (categoria) {
						catImportadosPromise.push (moodleFactory.getCategoriesImportCategory(categoria.id));   
					});	

					$q.all(catImportadosPromise).then(function(data) {
						angular.forEach(data, function (myItem) {
							if (myItem.data.length > 0) {
								$scope.subCategoriasUnaj.push(myItem.data[0])		
							}
						});	

						logSuccess('Se obtuvieron ' +$scope.subCategoriasUnaj.length+' subcategorias de Moodle','moodleFactory.getCategoriesImportCategory',$scope.subCategoriasUnaj);
					});
			    }
			}).error(function(data, status, header, config) {
				if (status == -1)
					logError('Error al intentar obtener categorias de Moodle: Tiempo de espera agotado','moodleFactory.getCategoriesByParent',data);
			    else
					logError('Error al intentar obtener categorias de Moodle','moodleFactory.getCategoriesByParent',data);
			});

		//Mando a pedir cursos de moodle 
		var moodleGroupsPromise = [];
		var moodleGroupsMembersPromise = [];
		var moodleCursosPromise = moodleFactory.getCourses(null);
		console.log('Hola3!!');
		moodleCursosPromise
			.success(function(data) {
			    if (data.exception) {
					console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
					logError('Error al intentar obtener cursos de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.getCursos',data);
			    }else{

					logSuccess('Se obtuvieron' +data.length+' cursos de Moodle');
					$scope.moodlecourses = data; 

					//Control de sincronizacion por obtencion de cursos (SIU), comisiones (SIU), categorias (Moodle) y usuarios (Moodle)
					$q.all(requestPromise).then(function(data) {
						console.log('Se obtuvieros cursos (moodle), categorias (moodle) y comisiones(siu) correctamente');
						for (var i = 0; i < $scope.actividades.length; i++) {
							
							$scope.actividades[i].migrado =  $filter('actividadMigrated')($scope.actividades[i].codigo,$scope.moodlecourses);
							$scope.actividades[i].curso = getSIUCourseID($scope.actividades[i].codigo);
							
							if ($scope.actividades[i].migrado && $scope.actividades[i].curso == 0) {
								$scope.actividades[i].codError = 100;
							}
							$scope.actividades[i].moodleCategoryID =  getMoodleCategoryID($scope.actividades[i].codigo,false);
							$scope.actividades[i].parentMoodleCategoryID =  getMoodleCategoryID($scope.actividades[i].codigo,true);
						} 
						var groupsPromise = [];
						//Itero sobre todos los cursos y obtengo los grupos
						angular.forEach($scope.moodlecourses, function (myItem) {
						    groupsPromise.push (moodleFactory.getCourseGroups(myItem.id));
						});							

						
						var groupsMembersPromise = [];
						//Itero sobre los grupos y obtengo los miembros
						$q.all(groupsPromise).then(function(data) {
							logSuccess('Se obtuvieron '+data.length+' grupos de moodle');
							angular.forEach(data, function (myItem) {
								if (myItem.data.length > 0) {
									addGroupsToCourse(myItem.data);
									groupIDs = [];
									for (var j = 0; j < myItem.data.length; j++){
										groupIDs.push(myItem.data[j].id)
									}	
									groupsMembersPromise.push(moodleFactory.getGroupsMembers(groupIDs));			
								}
							});	
							$q.all(groupsMembersPromise).then(function(data) {
								logSuccess('Se obtuvieron miembros de grupos');
								angular.forEach(data, function (courses) {
									addMembersToGroup(courses.data);
								});

								
								//Mapa de MOODLE completo
								console.log('Mapa de cursos de moodle: ',$scope.moodlecourses);

								//Mapa de SIU completo
								console.log('Mapa de actividades de moodle: ',$scope.actividades);

								$scope.tableParams.reload();


								$scope.dataInitialized = true;
								logInfo('Se Inicializaron los datos correctamente');
							});
							
						});
			
					});	
			    }
			}).error(function(data, status, header, config) {
			    if (status == -1)
					logError('Error al intentar obtener cursos de Moodle: Tiempo de espera agotado','moodleFactory.getCursos.error',data);
			    else
					logError('Error al intentar obtener cursos de Moodle','moodleFactory.getCursos',data);
			});
	
	}

	//Crear Curso
	$scope.importCourse = function (siuActividad,categoria){
		console.log('importCourse',siuActividad);
		var categoriaid = getImportCategory(siuActividad.moodleCategoryID);
		if (categoriaid != 0)
			moodleFactory.createCourse(siuActividad.nombre,siuActividad.codigo,getImportCategory(siuActividad.moodleCategoryID)).
			success(function(data) {
			    if (data.exception)
					logError('Hubo un error al importar actividad '+siuActividad.nombre+' en moodle','importCourse.createCourse.Error'+data.exception + '\n'+data.message +'\n'+data.debuginfo);
			    else{
					logInfo('Se creo curso en moodle para actividad '+siuActividad.nombre);
					siuActividad.migrado = true;
					//Sincronizo con SIU (Creo curso)
					var moodleCourseID = data[0].id;
					$scope.moodlecourses.push(data[0]);
					$scope.tableParams.reload();
					/*siuFactory.createCurso(moodleCourseID,data[0].shortname)
						.success(function(data) {
						    if ( (data.status == 204) || (data.status == 201)){
								logInfo('El curso para la actividad '+siuActividad.codigo+' fue creado en SIU');
								siuActividad.curso = moodleCourseID;
								$scope.tableParams.reload();
							}

							//Ahora agrego la comision al curso -> Esto se hace al sincronizar!
							/*
							siuFactory.addComisionCurso(moodleCourseID,siuComision.comision).
							success(function(data) {
							    if ( (data.status == 204)){
								siuComision.error = false;
								siuComision.codError = 0;
								siuComision.curso = moodleCourseID;
								$scope.tableParams.reload();
								logSuccess('La comision '+siuComision.actividad_codigo+' fue agregada al curso de SIU M-'+moodleCourseID,'siuFactory.addComisionCurso',data);
							    }
							    else {
								siuComision.error = true;
								siuComision.codError = 100;
								logError('Hubo un error al intentar asignar la comision '+siuComision.actividad_codigo+' al curso M-'+moodleCourseID,'siuFactory.addComisionCurso',data);
								}
							}).error(function(data) {
							     logError('Hubo un error al intentar asignar la comision '+siuComision.actividad_codigo+' al curso M-'+moodleCourseID,'siuFactory.addComisionCurso',data);
							});
						    }*/

/*
						    else {
								siuActividad.codError = 100;
								logError('Hubo un error al crear el curso en SIU para la actividad '+siuActividad.codigo,'siuFactory.createCurso',data);
								$scope.tableParams.reload();
							}
						}).error(function(data) {
							console.log('importCourse.createCourse.error',data);
						});		*/	
			    }
			}).error(function(data) {
			     console.log('importCourse.Error',data);
			});
		else
			logError('Hubo un error al crear el curso en SIU para la actividad '+siuActividad.codigo+' no existe subcategoria importados en moodle','siuFactory.createCurso',data);
	};

	/**
	* 100: Se importo actividad a moodle pero no se creo curso en SIU
	**/
	$scope.repairCourse = function (siuActividad){
		console.log('repairCourse',siuActividad);
		if (siuActividad.codError = 100){
			moodleCourseID = getMoodleCourseID(siuActividad.codigo);
			siuFactory.createCurso(moodleCourseID,siuActividad.codigo).
			success(function(data) {
			    if ( (data.status == 204) || (data.status == 201)){
					logInfo('El curso para la actividad '+siuActividad.codigo+' fue creado');
					siuActividad.codError = 0;
					siuActividad.curso = moodleCourseID;
					$scope.tableParams.reload();

				//Ahora agrego la comision al curso -> Esto se hace al sincronizar!
				/*
				siuFactory.addComisionCurso(moodleCourseID,siuComision.comision).
				success(function(data) {
				    if ( (data.status == 204)){
					siuComision.error = false;
					siuComision.codError = 0;
					siuComision.curso = moodleCourseID;
					$scope.tableParams.reload();
					logSuccess('La comision '+siuComision.actividad_codigo+' fue agregada al curso de SIU M-'+moodleCourseID,'siuFactory.addComisionCurso',data);
				    }
				    else {
					logError('Hubo un error al intentar asignar la comision '+siuComision.actividad_codigo+' al curso M-'+moodleCourseID,'siuFactory.addComisionCurso',data);
					}
				}).error(function(data) {
				     logError('Hubo un error al intentar asignar la comision '+siuComision.actividad_codigo+' al curso M-'+moodleCourseID,'siuFactory.addComisionCurso',data);
				});*/

			    }
			    else {
					logError('Hubo un error al crear el curso en SIU para la actividad '+siuActividad.codigo,'siuFactory.createCurso',data);
				}
			}).error(function(data) {
			     logError('Hubo un error al crearl el curso en SIU para la actividad '+siuActividad.codigo,'siuFactory.createCurso',data);
			});
		}
		
	};

	//Sincronizar Actividad <-> Curso
	function _syncrhonizeCourse(siuActividad){

		//Callback para controlar sincronizacion de varios cursos
		var deferred = $q.defer();


		logInfo('Comenzando sincronizacion de actividad '+siuActividad.codigo+'...');


		var moodleCourse = getMoodleCourseByActividad(siuActividad.codigo);

		if (moodleCourse == null){
			logError('Hubo un error al crear el comision en MOODLE para la comision '+comision.comision+' no existe curso asociado en moodle','siuFactory.moodleFactory.createGroupForCourse',data); 
			return;
		}

		/* 
		* Sincronizo comisiones
		* 1) Itero sobre todos las comisiones de siu que no estan en moodle y las agrego
		* 2) Itero sobre todos las comisiones de moodle que no estan en siu y las borro
		*/
		
		// (1)
		var addComisionesPromise = [];
		var count = 0;
		angular.forEach(siuActividad.comisiones, function (comision) {
			console.log(comision.actividad.codigo);

			if ( !$filter('comisionMigrated')(comision.comision,$scope.moodlecourses) )	{
				count++;
		    	addComisionesPromise.push (moodleFactory.createGroupForCourse(moodleCourse.id,comision.comision));  
			}
		});	

		logInfo('Comisiones sin migrar a Moodle: '+count);

		// (2)
		var deleteComisionesPromise = [];
		count = 0;
		angular.forEach($scope.moodlecourses, function (course) {
			if ($filter('actividadEquals')(siuActividad.codigo,course.shortname))
				angular.forEach(course.comisiones, function (comisionMoodle) {
					var exist = false;
					angular.forEach(siuActividad.comisiones, function (comisionSiu) {
						if (comisionMoodle.name == comisionSiu.comision)
							exist = true;
					});	
					if (!exist){
						count++;
						deleteComisionesPromise.push(moodleFactory.deleteGroup(comisionMoodle.id))
					}
				});	
		});	

		logInfo('Comisiones migradas que ya no estan en siu: '+count);


		$q.all( addComisionesPromise.concat(deleteComisionesPromise) ).then(function (data){

			angular.forEach(data, function (myItem) {

				//Resolve create callbacks (Actualizo mapa de moodle)
				if (myItem.config.data.wsfunction == moodleFactory.createGroupForCourseFunctionName()) {
					if (myItem.data.exception) {
						console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
						logError('Error al intentar crear grupo:'+'\n'+myItem.data.exception+'\n'+myItem.data.message +'\n'+myItem.data.debuginfo,'moodleFactory.createGroupForCourse',data);
					}
					else {
						addGroupsToCourse(myItem.data);
						//Actualizo moodle course
						moodleCourse = getMoodleCourseByActividad(siuActividad.codigo);
					}
					
				}

				//Resolve delete callbacks (Actualizo mapa de moodle (VER!))
				else if (myItem.config.data.wsfunction == moodleFactory.deleteGroupFunctionName()) {
					if (myItem.data && myItem.data.exception) {
							console.log(data.exception + '\n'+data.message +'\n'+data.debuginfo);
							logError('Error al intentar eliminar grupo:'+'\n'+myItem.data.exception+'\n'+myItem.data.message +'\n'+myItem.data.debuginfo,'moodleFactory.deleteGroup',data);
						}
				}

			});

			//Sigo con el resto

			/* 
			* Sincronizo estudiantes/docentes
			* 1) Itero sobre todos los estudiantes/docentes por comision de siu y por cada uno que no esta
			* en moodle:
			+	1.1) Si no existe como user en moodle lo creo
			+	1.2) lo agrego con perfil estudiante/profesor al curso
			+	1.3) lo agrego al grupo (comision)
			* 2) Itero sobre todos los estudiantes/docentes de moodle por comisiones y por cada uno que no esta en siu
			* lo elimino del grupo (comision)
			*/
			
			// (1)
			count = 0;
			var countNotExistInMoodle = 0;

			//Control para continuar ejecucion solo cuando todas las promesas fueron resueltas
			var studentsPromise = [];


			//1.1
			var createUserPromise = [];
			angular.forEach(siuActividad.comisiones, function (comision) {
				console.log('Comisiones:',comision);
				angular.forEach(comision.alumnos, function (alumno) {
					
					
					console.log('Alumno:',alumno);

					if ( !$filter('userExistInMoodle')(alumno,$scope.moodleusers) )	{
						countNotExistInMoodle++;
						createUserPromise.push(moodleFactory.createUser(alumno.usuario,"@1B2c3D4",alumno.nombres,alumno.apellido,alumno.email));
					}
				});

				angular.forEach(comision.docentes, function (docente) {
					
					
					console.log('Docente:',docente);

					if ( !$filter('userExistInMoodle')(docente.docente,$scope.moodleusers) )	{
						countNotExistInMoodle++;
						createUserPromise.push(moodleFactory.createUser(docente.docente.usuario.toLowerCase(),"@1B2c3D4",docente.docente.nombres,docente.docente.apellido,docente.docente.email));
					}
				});
			});

			//Actualizo mapa de moodle
			$q.all(createUserPromise).then(function (data){
				angular.forEach(data, function(myItem){ 
					if (!myItem.data.exception){
						$scope.moodleusers.push(myItem.data);
						console.log('Los usuarios despues de agregar'+$scope.moodleusers)
					}
					else{
						logError('Error al crear usuario',"moodleFactory.createUser",myItem);
					}
						

				});


				//1.2
				var assignRolePromises = [];
				angular.forEach(siuActividad.comisiones, function (comision) {
					console.log('Comisiones:',comision);
					angular.forEach(comision.alumnos, function (alumno) {
						
						if ( !$filter('estudianteMigrated')(alumno,comision.comision,$scope.moodlecourses) )	{

							//userid: lo saco de los usuarios de moodle
							var user = getMoodleUserByUsername(alumno.usuario);
							if (user != null)
								assignRolePromises.push(moodleFactory.enrolStudent(user.id,moodleCourse.id));
							else
								logError('Error al asignar usuario a curso, el usuario no existe en moodle',"moodleFactory.createUser",alumno)


						}

					});

					angular.forEach(comision.docentes, function (docente) {
						
						if ( !$filter('docenteMigrated')(docente.docente,comision.comision,$scope.moodlecourses) )	{

							//userid: lo saco de los usuarios de moodle
							var user = getMoodleUserByUsername(docente.docente.usuario);
							if (user != null)
								assignRolePromises.push(moodleFactory.enrolTeaching(user.id,moodleCourse.id));
							else
								logError('Error al asignar usuario a curso, el usuario no existe en moodle',"moodleFactory.createUser",docente)


						}

					});
				});

				$q.all(assignRolePromises).then(function (data){
					angular.forEach(data, function(myItem){ 
						if (!myItem.data)
							console.log('Asignado a curso');
						else
							logError('Error al asignar usuario a curso','moodleFactory.enrolStudent',myItem);
					});


					//1.3
					var addToGroupPromises = [];
					angular.forEach(siuActividad.comisiones, function (comision) {
						console.log('Comisiones:',comision);
						angular.forEach(comision.alumnos, function (alumno) {
							
							if ( !$filter('estudianteMigrated')(alumno,comision.comision,$scope.moodlecourses) )	{
								var user = getMoodleUserByUsername(alumno.usuario);
								if (user != null) {
									var group = getMoodleGroupByComision(comision.comision,moodleCourse);
									addToGroupPromises.push(moodleFactory.addGroupMember(group.id,user.id));
								}
								else
									logError('Error al asignar usuario a grupo, el usuario no existe en moodle',"moodleFactory.createUser",alumno)

							}

						});

						angular.forEach(comision.docentes, function (docente) {
							
							if ( !$filter('docenteMigrated')(docente.docente,comision.comision,$scope.moodlecourses) )	{
								var user = getMoodleUserByUsername(docente.docente.usuario);
								if (user != null) {
									var group = getMoodleGroupByComision(comision.comision,moodleCourse);
									addToGroupPromises.push(moodleFactory.addGroupMember(group.id,user.id));
								}
								else
									logError('Error al asignar usuario a grupo, el usuario no existe en moodle',"moodleFactory.createUser",docente)

							}

						});
					});

					$q.all(addToGroupPromises).then(function (data){
						angular.forEach(data, function(myItem){ 
							console.log(myItem);
							if (!myItem.data){
								
								var user = getMoodleUserByID(myItem.config.data.members[0].userid);
								user.groupid = myItem.config.data.members[0].groupid;
								console.log('asignado a grupo',user);
								addMembersToGroup(user);
							}
							else
								logError('Error al asignar alumno a curso','moodleFactory.enrolStudent',data);
						});


						//Disparo finalizacion
						deferred.resolve('Termine');

					});
					
				});

			});
			
		});
    
	  return deferred.promise;
	};


    //Sincronizar Actividad <-> Curso
	$scope.syncrhonizeCourse = function (siuActividad){
		_syncrhonizeCourse(siuActividad).then(function (data){
			logSuccess('Finalizada migracion de actividad: '+siuActividad.codigo);
		});
	}


	var getMoodleCategoryID = function (codigoActividad,parent) {
		for(var i = 0; i<$scope.moodlecourses.length; i++){
			if ($scope.moodlecourses[i].shortname == PROPERTIES.CURRENT_YEAR+'-'+codigoActividad)
				if (parent)	
					return 	getParentCategory($scope.moodlecourses[i].categoryid);
				else
					return 	$scope.moodlecourses[i].categoryid;
		}
		return null;
	};

	var getSIUCourseID = function (codigoActividad) {
		for(var i = 0; i<$scope.cursosSiu.length; i++){
			if ($scope.cursosSiu[i].nombre == PROPERTIES.CURRENT_YEAR+'-'+codigoActividad)	
				return 	$scope.cursosSiu[i].curso;
		}
		return 0;
	};

	var getMoodleCourseID = function (codigoActividad) {
		for(var i = 0; i<$scope.moodlecourses.length; i++){
			if ($scope.moodlecourses[i].shortname == PROPERTIES.CURRENT_YEAR+'-'+codigoActividad)
				return 	$scope.moodlecourses[i].id;
		}
		return 0;
	};

	var getMoodleCourseByActividad = function (codigoActividad) {
		for(var i = 0; i<$scope.moodlecourses.length; i++){
			if ($scope.moodlecourses[i].shortname == PROPERTIES.CURRENT_YEAR+'-'+codigoActividad)
				return 	$scope.moodlecourses[i];
		}
		return null;
	};

	var getMoodleGroupByComision = function (comisionSiu,cursoMoodle) {
		console.log('Entre con',cursoMoodle);
		for(var i = 0; i<cursoMoodle.comisiones.length; i++){
			if (cursoMoodle.comisiones[i].name == comisionSiu)
				return 	cursoMoodle.comisiones[i];
		}
		return null;
	};

	var getMoodleUserByUsername = function (username) {
		for(var i = 0; i<$scope.moodleusers.length; i++){
			if ($scope.moodleusers[i].username == username.toLowerCase())
				return 	$scope.moodleusers[i];
		}
		return null;
	};

	var getMoodleUserByID = function (id) {
		for(var i = 0; i<$scope.moodleusers.length; i++){
			if ($scope.moodleusers[i].id == id)
				return 	$scope.moodleusers[i];
		}
		return null;
	};

	//Funcion que refresca datos de la ngTable manteniento filtros y ordenamiento
	var resetTableParams = function(){
	    return {
		total: $scope.actividades.length,
		getData: 
			function($defer, params) {
			    var filteredData = params.filter() ? $filter('filter')($scope.actividades,    params.filter()) : $scope.actividades;
			    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData; 

			    params.total(orderedData.length);
			    data = orderedData.slice((params.page() -1) * params.count(), params.page() * params.count());
			    $defer.resolve(data); 		          
			}
	    }
	}


	var addStudentsToComision = function(students,idcomision){
	    for (i = 0; i < $scope.actividades.length ; i++){
	    	for ( j = 0 ; j< $scope.actividades[i].comisiones.length ; j++) {
	    		if ($scope.actividades[i].comisiones[j].comision == idcomision){
	    			$scope.actividades[i].comisiones[j].alumnos = students;
	    			console.log('Agregue alumnos',$scope.actividades[i].comisiones[j])
	    		}

	    	}
	    }
	}

	var addProfesorsToComision = function(profesors,idcomision){
	    for (i = 0; i < $scope.actividades.length ; i++){
	    	for ( j = 0 ; j< $scope.actividades[i].comisiones.length ; j++) {
	    		if ($scope.actividades[i].comisiones[j].comision == idcomision){
	    			$scope.actividades[i].comisiones[j].docentes = profesors;
	    			console.log('Agregue docentes',$scope.actividades[i].comisiones[j])
	    		}

	    	}
	    }
	}



	var addGroupsToCourse = function(groups){
	    for (i = 0; i < $scope.moodlecourses.length ; i++){
	    	if ( $scope.moodlecourses[i].id == groups[0].courseid) {
	    		if ($scope.moodlecourses[i].comisiones != 'undefined')
	    			$scope.moodlecourses[i].comisiones = groups;
	    		else
	    			$scope.moodlecourses[i].comisiones.push(groups)
	    	}
	    }
	}

	var addMembersToGroup = function(members){
		for (m = 0 ; m < members.length ; m++){
		    for (i = 0; i < $scope.moodlecourses.length ; i++){
		    	if ($scope.moodlecourses[i].comisiones){
			    	for (j = 0; j<$scope.moodlecourses[i].comisiones.length ; j++){
			    		if ( $scope.moodlecourses[i].comisiones[j].id == members[m].groupid) {
			    			if ($scope.moodlecourses[i].comisiones[j].estudiantes)
			    				$scope.moodlecourses[i].comisiones[j].estudiantes.push(members);
			    			else
				    			$scope.moodlecourses[i].comisiones[j].estudiantes = members[m].users;
				    	}
			    	}
			    }
		    	
		    }
		}
	}

	var getImportCategory = function(categoryid){
		for (i = 0 ; i < $scope.subCategoriasUnaj.length ; i++){
    		if ( $scope.subCategoriasUnaj[i].parent == categoryid)
	    		return $scope.subCategoriasUnaj[i].id;
		}
		return 0;
	}

	/*
		En base a la categoria de un curso tengo que obtener la categoria principal 
		(O sea que tiene como parent a la categoria que esta en el PROPERTIES )
	*/
	var getParentCategory = function(importCategoyid){
		for (i = 0 ; i < $scope.subCategoriasUnaj.length ; i++){
    		if ( $scope.subCategoriasUnaj[i].id == importCategoyid)
	    		return $scope.subCategoriasUnaj[i].parent;
		}
		return 0;
	}
	
	//Inicializo Table Params
	$scope.tableParams = new ngTableParams({}, resetTableParams());
	
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

	//Para agrupar actividades
	var indexedActivities = [];
    filterActividades = function(comision) {
        var actividadIsNew = indexedActivities.indexOf(comision.actividad.codigo) == -1;
        if (actividadIsNew) {
            indexedActivities.push(comision.actividad.codigo);
        }
        return actividadIsNew;
    }

    //Para agrupar Periodos Lectivos
	var indexedPeriodos = [];
    filterPeriodos = function(comision) {
        var periodoIsNew = indexedPeriodos.indexOf(comision.periodo_lectivo.periodo_lectivo) == -1;
        if (periodoIsNew) {
            indexedPeriodos.push(comision.periodo_lectivo.periodo_lectivo);
        }
        return periodoIsNew;
    }

	
		
		
});
