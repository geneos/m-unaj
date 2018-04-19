app.controller('siuMoodleCtrl', function($scope,$http,$q, $filter,$exceptionHandler,PROPERTIES,ngTableParams,moodleFactory,siuFactory) {

	$scope.logArea = '';
	
	logInfo = function (text){
		$scope.logArea = $scope.logArea + '[INFO] '+text+'\n';
		console.info(text);
		moveCaretToEnd();
	}

	logSuccess = function (text,caller,object){
		$scope.logArea = $scope.logArea + '[SUCESS] '+text+'\n';
		console.log(caller+'.success',object);
		moveCaretToEnd();
	}
	
	logError = function (text,caller,object){
		$scope.logArea = $scope.logArea + '[ERROR] '+text+'\n';
		console.error(caller+'.error: '+text,object);
		moveCaretToEnd();
		$scope.errorCount++;
	}

	$scope.logClear = function (){
		$scope.logText = '';
	}


	function moveCaretToEnd() {
		var el = document.getElementById("logArea");
		setTimeout(function(){ el.scrollTop = el.scrollHeight; }, 250);
	}

	$scope.dataInitialized = false;
	$scope.periodosInitialized = false;
	$scope.spinner = false;
	$scope.errorCount = 0;

	$scope.siuLimit = 9999;
	$scope.siuPage = 1;

	$scope.selectedAll = false;


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
		moodleFactory.getCategoriesByParent(5)
		.success(function(data) {
		    if (data.exception) {
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

	//TEST DE CREAR USUARIO
	$scope.testUser = function(){
		logInfo('Comenzando creado de usuario...');
		moodleFactory.createUser("123456","@1B2c3D4","test","test2","test@testaso.com")
		.success(function(data) {
		    if (data.exception) {
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

		$scope.spinner = true;
		//Seteo configuracion de siuFactory
		siuFactory.setUrl(PROPERTIES.SIU_REST_URI);
		siuFactory.setUser($scope.siuUser);
		siuFactory.setPassword($scope.siuPassword);
		
		//Seteo configuracion Moodle Factory
		moodleFactory.setUrl(PROPERTIES.MOODLE_REST_URI);
		moodleFactory.setToken($scope.moodleToken);

		$scope.periodosLectivos = [];
		var comisionesPromise = siuFactory.getAllComisiones($scope.siuLimit,$scope.siuPage)
			.success(function(data) {
			    if (data.mensaje || !data[0]){
					logError('Error al intentar obtener comisiones de SIU: '+data.mensaje,'siuFactory.getComisiones',data);
			    }
			    else {
			    	try {
				    	indexedPeriodos = [];
						angular.forEach(data,function (comision){
							if (filterPeriodos(comision)) {
								$scope.periodosLectivos.push(comision.periodo_lectivo);
							}
						});

						//Agrego opcion de Todos los periodos lectivos
						$scope.periodosLectivos.unshift({'nombre':'Todos','periodo_lectivo':0});

						$scope.comisiones = data; 
						logSuccess('Se obtuvieron ' +$scope.comisiones.length+' Comisiones de SIU ','siuFactory.getComisiones',$scope.comisiones);
					    logSuccess('Se obtuvieron ' +$scope.periodosLectivos.length+' Periodos Lectivos de SIU ','siuFactory.getComisiones.PeriodosLectivos',$scope.periodosLectivos);
					}

				    catch (e) {
						$exceptionHandler(e);
						logError('Error al intentar obtener comisiones de SIU: '+e.message,'siuFactory.getComisiones',data);
					}

				}

				
			}).error(function(data, status, header, config) {
			    logError('Error al intentar obtener comisiones de SIU','siuFactory.getComisiones',data);
			});


		//requestQueue
		var requestPromise = [];


		//Mando a pedir usuarios de moodle
		var moodleUsersPromise = moodleFactory.getUsers();
		requestPromise.push(moodleUsersPromise);	
		moodleUsersPromise
			.success(function (data) {
					if(!data.exception){
						console.info('TODOS LOS USUARIOS',data);
						$scope.moodleusers =  data.users;
						logInfo('Se obtuvieron '+data.users.length + ' usuarios de moodle')
					}
					else
						logError('Error al intentar obtener usuarios de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.getUsers',data);
				})
				.error(function (error){
					logError('Error al intentar obtener usuarios de moodle','moodleFactory.getUsers',data);
				});

		//Mando a pedir categoria por id de categoria padre (Categoria donde se encuentran las sub categorias facultades)
		var moodleCategoriesPromise = moodleFactory.getCategoriesByParent(PROPERTIES.MOODLE_ROOT_CATEGORY_ID,false);
		requestPromise.push(moodleCategoriesPromise);		
		moodleCategoriesPromise
			.success(function(data) {
			    if (data.exception)
					logError('Error al intentar obtener categorias de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.getCategoriesByParent',data);
			    else{

					$scope.categoriasUnaj = data;
					logSuccess('Se obtuvieron ' +$scope.categoriasUnaj.length+' categorias de Moodle','moodleFactory.getCategories',$scope.categoriasUnaj);
					
					moodleFactory.getCategoriesByParent(PROPERTIES.MOODLE_ROOT_CATEGORY_ID,true)
					.success(function(data) {
						console.log(data);
						$scope.subCategoriasUnaj = data;
						logSuccess('Se obtuvieron ' +$scope.subCategoriasUnaj.length+' sub categorias de Moodle','moodleFactory.getSubCategories',$scope.subCategoriasUnaj);
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
		moodleCursosPromise
			.success(function(data) {
			    if (data.exception) {
					logError('Error al intentar obtener cursos de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.getCursos',data);
			    }else{

					logSuccess('Se obtuvieron ' +data.length+' cursos de Moodle');
					$scope.moodlecourses = data; 

					//Control de sincronizacion por categorias (Moodle) y usuarios (Moodle)
					$q.all(requestPromise).then(function(data) {

						for (var i = 0; i < $scope.actividades.length; i++) {
							$scope.actividades[i].moodleCategoryID =  getMoodleCategoryID($scope.actividades[i].codigo,true,$scope.actividades[i].periodoLectivo.periodo_lectivo);
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
								logInfo('Se Inicializaron los datos moodle correctamente');

								
								$q.all(comisionesPromise).then( function(data){
									$scope.spinner = false;
									$scope.periodosInitialized = true;
								});
							});

							
						});
			
					});	
			    }
			}).error(function(data, status, header, config) {
				$scope.spinner = false;
			    if (status == -1)
					logError('Error al intentar obtener cursos de Moodle: Tiempo de espera agotado','moodleFactory.getCursos.error',data);
			    else
					logError('Error al intentar obtener cursos de Moodle','moodleFactory.getCursos',data);
			});
	}




	/*$scope.initData = function(){

		if ( !$scope.periodosInitialized ){
			logInfo('Por favor seleccione un Periodo Lectivo');
			return
		}

		logInfo('Comenzando la inicializacion de datos...');
		$scope.spinner = true;

    	//Filtro por periodo
		var comisionesFiltered = $scope.comisiones.filter(function (comision) {
		    return (comision.periodo_lectivo.periodo_lectivo == $scope.periodoSelected.periodo_lectivo);
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
			  							//'curso':0,
			  							'codError':0,
			  							'$hideRows':true,
			  							'periodoLectivo':comisionesFiltered[i].periodo_lectivo
			  							});
			  	actividadesCount++;
		  	}

		actividadPos = indexedActivities.indexOf(comisionesFiltered[i].actividad.codigo+'-'+comisionesFiltered[i].periodo_lectivo.periodo_lectivo);
  		$scope.actividades[actividadPos].comisiones.push(comisionesFiltered[i]);
		
		}

	    //Itero sobre todos las actividades y obtengo los docentes
	    var docentesPromise = [];
		angular.forEach($scope.actividades, function (actividad) {
			angular.forEach(actividad.comisiones, function (comision) {
				docentesPromise.push (siuFactory.getDocentes(comision.comision));
			});
		    
		});	

		//Itero sobre todos las actividades y obtengo los estudiantes
	    var estudiantesPromise = [];
		angular.forEach($scope.actividades, function (actividad) {
			angular.forEach(actividad.comisiones, function (comision) {
				estudiantesPromise.push (siuFactory.getAlumnos(comision.comision));
			});
		    
		});	


		var docentesSiuFinishedDefer = $q.defer();
		var docentesSiuFinishedPromise = docentesSiuFinishedDefer.promise;
		$q.all(docentesPromise).then(function(data) {
			for (i=0 ; i<data.length ; i++){
				if (data[i].data.length > 0)
					addProfesorsToComision(data[i].data,data[i].config.data.comision);
			}
			docentesSiuFinishedDefer.resolve();
		});

		var estudiantesSiuFinishedDefer = $q.defer();
		var estudiantesSiuFinishedPromise = estudiantesSiuFinishedDefer.promise;
		$q.all(estudiantesPromise).then(function(data) {
			for (i=0 ; i<data.length ; i++){
				if (data[i].data.length > 0)
					addStudentsToComision(data[i].data,data[i].config.data.comision);
			}
			estudiantesSiuFinishedDefer.resolve();
		});

		//Mando a pedir cursos de siu y agrego a la cola de request
		var siuCursosPromise = siuFactory.getCursos();
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
		var moodleCategoriesPromise = moodleFactory.getCategoriesByParent(PROPERTIES.MOODLE_ROOT_CATEGORY_ID,false);
		requestPromise.push(moodleCategoriesPromise);		
		moodleCategoriesPromise
			.success(function(data) {
			    if (data.exception)
					logError('Error al intentar obtener categorias de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.getCategoriesByParent',data);
			    else{
					logSuccess('Se obtuvieron ' +data.length+' categorias de Moodle','moodleFactory.getCategoriesByParent',data);
					$scope.categoriasUnaj = data;	

					$scope.subCategoriasUnaj = $scope.categoriasUnaj;

					//Itero sobre todos las categorias y obtengo las categorias "importados"
				    var catImportadosPromise = [];
					angular.forEach($scope.categoriasUnaj, function (categoria) {
						catImportadosPromise.push (moodleFactory.getCategoriesByParent(categoria.id,true));   
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
		moodleCursosPromise
			.success(function(data) {
			    if (data.exception) {
					logError('Error al intentar obtener cursos de Moodle:'+'\n'+data.exception+'\n'+data.message +'\n'+data.debuginfo,'moodleFactory.getCursos',data);
			    }else{

					logSuccess('Se obtuvieron ' +data.length+' cursos de Moodle');
					$scope.moodlecourses = data; 

					//Control de sincronizacion por obtencion de cursos (SIU), comisiones (SIU), categorias (Moodle) y usuarios (Moodle)
					$q.all(requestPromise).then(function(data) {
						for (var i = 0; i < $scope.actividades.length; i++) {
														$scope.actividades[i].migrado =  $filter('actividadMigrated')($scope.actividades[i].codigo,$scope.moodlecourses,$scope.actividades[i].periodoLectivo);
							//$scope.actividades[i].curso = getSIUCourseID($scope.actividades[i].codigo);
							
							if ($scope.actividades[i].migrado && $scope.actividades[i].curso == 0) {
								$scope.actividades[i].codError = 100;
							}
							$scope.actividades[i].moodleCategoryID =  getMoodleCategoryID($scope.actividades[i].codigo,true,$scope.actividades[i].periodoLectivo.periodo_lectivo);
							//$scope.actividades[i].parentMoodleCategoryID =  getMoodleCategoryID($scope.actividades[i].codigo,true);
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

							//Me aseguro que los estudiantes y docentes de siu ya estan mapeados para el filtro
							$q.all([docentesSiuFinishedPromise,estudiantesSiuFinishedPromise]).then(function(data) { 
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



									$scope.spinner = false;
									$scope.dataInitialized = true;
									logInfo('Se Inicializaron los datos correctamente');
								});
							})
							
						});
			
					});	
			    }
			}).error(function(data, status, header, config) {
				$scope.spinner = false;
			    if (status == -1)
					logError('Error al intentar obtener cursos de Moodle: Tiempo de espera agotado','moodleFactory.getCursos.error',data);
			    else
					logError('Error al intentar obtener cursos de Moodle','moodleFactory.getCursos',data);
			});
	
	}*/

	//Crear Curso
	function _importCourse (siuActividad,categoria){

		$scope.spinner = true;

		//Callback para controlar importacion de varios cursos
		var deferred = $q.defer();

		var categoriaid = getImportCategory(siuActividad.moodleCategoryID);
		if (categoriaid != 0 ) {
			moodleFactory.createCourse(siuActividad.nombre,siuActividad.codigo,categoriaid,siuActividad.periodoLectivo).
			success(function(data) {
			    if (data.exception)
					logError('Hubo un error al importar actividad '+siuActividad.nombre+' en moodle','importCourse.createCourse.Error'+data.exception + '\n'+data.message +'\n'+data.debuginfo,data);
			    else{
					logInfo('Se creo curso en moodle para actividad '+siuActividad.nombre);
					siuActividad.migrado = true;
					var moodleCourseID = data[0].id;
					$scope.moodlecourses.push(data[0]);
					$scope.tableParams.reload();

					$scope.spinner = false;
					deferred.resolve('Termine');

					//Sincronizo con SIU (Creo curso) -> No utilizo cursos de SIU, dejar para agrupar luego


			    }
			}).error(function(data) {
			     console.log('importCourse.Error',data);
			});
		}
		else
			logError('Hubo un error al crear el curso en Moodle para la actividad '+siuActividad.codigo+' no existe subcategoria importados en moodle','moodleFactory.createCourse',data);
	
		return deferred.promise;
	};

	/**
	* 100: Se importo actividad a moodle pero no se creo curso en SIU
	**/
	$scope.repairCourse = function (siuActividad){
		if (siuActividad.codError = 100){
			moodleCourseID = getMoodleCourseID(siuActividad.codigo,siuActividad.periodoLectivo);
			siuFactory.createCurso(moodleCourseID,siuActividad.codigo).
			success(function(data) {
			    if ( (data.status == 204) || (data.status == 201)){
					logInfo('El curso para la actividad '+siuActividad.codigo+' fue creado');
					siuActividad.codError = 0;
					siuActividad.curso = moodleCourseID;
					$scope.tableParams.reload();
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
	_synchronizeActividadSinchronized = function(actividad){

		logInfo('Comenzando sincronizacion de actividad '+actividad.codigo+'...');

		var synchronizeActividadSinchronizedDefer = $q.defer();

		var moodleCourse = getMoodleCourseByActividad(actividad.codigo,actividad.periodoLectivo);

		if (moodleCourse == null){
			logError('Hubo un error al crear la comision en MOODLE para la actividad '+actividad.codigo+' no existe curso asociado en moodle para el periodo lectivo','siuFactory.moodleFactory.createGroupForCourse',data); 
			return;
		}

		/* 
		* Sincronizo comisiones
		* 1) Itero sobre todos las comisiones de siu que no estan en moodle y las agrego
		* 2) Itero sobre todos las comisiones de moodle que no estan en siu y las borro
		*/
		
		// (1)
		var newCount = 0;
		var oldCount = 0;

		var addComisionesPromise = [];

		angular.forEach(actividad.comisiones, function (comision) {

			if ( comision.selected && !$filter('comisionMigrated')(comision.nombre,$scope.moodlecourses,comision.actividad.codigo,$scope.periodoSelected) )	{
				newCount++;
		    	addComisionesPromise.push (moodleFactory.createGroupForCourse(moodleCourse.id,comision.nombre));  
			}
		});	

		logInfo('Se van a crear: '+addComisionesPromise.length+' nuevos grupos');

		// (2)
		var deleteComisionesPromise = [];

		angular.forEach(moodleCourse.comisiones, function (comisionMoodle) {
			var exist = false;
			angular.forEach(actividad.comisiones, function (comisionSiu) {
				if (comisionMoodle.name == comisionSiu.nombre)
					exist = true;
			});	
			if (!exist){
				oldCount++;
				deleteComisionesPromise.push(moodleFactory.deleteGroup(comisionMoodle.id))
			}
		});	

		logInfo('Se van a eliminar: '+deleteComisionesPromise.length+' nuevos grupos');

		$q.all( addComisionesPromise.concat(deleteComisionesPromise) ).then(function (data){

			angular.forEach(data, function (myItem) {

				//Resolve create callbacks (Actualizo mapa de moodle)
				if (myItem.config.data.wsfunction == moodleFactory.createGroupForCourseFunctionName()) {
					if (myItem.data.exception) {
						logError('Error al intentar crear grupo:'+'\n'+myItem.data.exception+'\n'+myItem.data.message +'\n'+myItem.data.debuginfo,'moodleFactory.createGroupForCourse',data);
					}
					else {
						addGroupsToCourse(myItem.data);
						//Actualizo moodle course
						moodleCourse = getMoodleCourseByActividad(actividad.codigo,actividad.periodoLectivo);
					}
					
				}

				//Resolve delete callbacks (Actualizo mapa de moodle (VER!))
				else if (myItem.config.data.wsfunction == moodleFactory.deleteGroupFunctionName()) {
					if (myItem.data && myItem.data.exception) {
							logError('Error al intentar eliminar grupo:'+'\n'+myItem.data.exception+'\n'+myItem.data.message +'\n'+myItem.data.debuginfo,'moodleFactory.deleteGroup',data);
						}
				}

			});

			var syncComisionSincronizedDefer = $q.defer();
			var syncComisionSincronizedPromise = syncComisionSincronizedDefer.promise;
			var queue = [];
			angular.forEach(actividad.comisiones, function(comision){ 
			if (comision.selected)
				queue.push(comision);
			});

			_synchronizeComisionQueue(queue,0,actividad.codigo,actividad.periodoLectivo,syncComisionSincronizedDefer);
			syncComisionSincronizedPromise.then( function(data){
				synchronizeActividadSinchronizedDefer.resolve();
			});

			

		});
		return synchronizeActividadSinchronizedDefer.promise;

	}

	//Sincronizar Actividad <-> Curso
	function _synchronizeComision(comision,codigoActividad,periodoActividad){

		//Callback para controlar sincronizacion de varias comisiones
		var deferred = $q.defer();
		$scope.spinner = true;

		logInfo('Comenzando sincronizacion de comision '+comision.nombre+'...');

		var moodleCourse = getMoodleCourseByActividad(codigoActividad,periodoActividad);


			//Sigo con el resto

			/* 
			* Sincronizo estudiantes/docentes
			* 1) Itero sobre todos los estudiantes/docentes de moodle por comisiones y por cada uno que no esta en siu
			* lo elimino del grupo (comision)
			*
			* 2) Itero sobre todos los estudiantes/docentes por comision de siu y por cada uno que no esta
			* en moodle:
			*	1.1) Si no existe como user en moodle lo creo
			*	1.2) lo agrego con perfil estudiante/profesor al curso
			*	1.3) lo agrego al grupo (comision)
			*/
			
			// (1)
			var removeFromCourse = [];

			var exist = false;
			for (j = 0 ; j<moodleCourse.comisiones.length ; j++){
				if (moodleCourse.comisiones[j].name == comision.nombre) {
					if (moodleCourse.comisiones[j].estudiantes){
						console.log('Estudiantes de comision '+moodleCourse.comisiones[j].name+' antes de sincronizar',moodleCourse.comisiones[j].estudiantes);
						for (h = 0 ; h<moodleCourse.comisiones[j].estudiantes.length ; h++){
							//Variable que controla si el alumno de moodle existe en siu
							exist = false;
								
							if (comision.alumnos)
								for (j2 = 0 ; j2<comision.alumnos.length ; j2++){
									if (comision.alumnos[j2].usuario.toLowerCase() == moodleCourse.comisiones[j].estudiantes[h].username){
										exist = true;
									}

								}
						if (!exist){
							removeFromCourse.push( moodleFactory.unenrolUser(moodleCourse.comisiones[j].estudiantes[h].id,moodleCourse.id) );
							}
						}
					}
/*
					if (moodleCourse.comisiones[j].docentes){
						console.log('Docentes de comision '+moodleCourse.comisiones[j].name+' antes de sincronizar',moodleCourse.comisiones[j].estudiantes)
						for (h = 0 ; h<moodleCourse.comisiones[j].docentes.length ; h++){
							//Variable que controla si el alumno de moodle existe en siu
							exist = false;
								
							if (comision.docentes)
								for (j2 = 0 ; j2<comision.docentes.length ; j2++){
									if (comision.docentes[j2].docente.usuario.toLowerCase() == moodleCourse.comisiones[j].docentes[h].username){
										exist = true;
									}

								}
						if (!exist){
							removeFromCourse.push( moodleFactory.unenrolUser(moodleCourse.comisiones[j].estudiantes[h].id,moodleCourse.id) );
							}
						}
					}*/
				}

			}
			
			logInfo('Se van a desmatricular: '+removeFromCourse.length+' usuarios');

			$q.all(removeFromCourse).then(function (data){

				// (2)

				//Control para continuar ejecucion solo cuando todas las promesas fueron resueltas
				var studentsPromise = [];

				//1.1
				var createUserPromise = [];
					angular.forEach(comision.alumnos, function (alumno) {
						if (!alumno.usuario) {
							logError('Alumno de SIU sin campo usuario asignado, se omite sincronizacion de dicho alumno ('+alumno.docente.apellido_nombres+')',"app.createUserPromise (alumno)",alumno);
						}
						else
							if ( !$filter('userExistInMoodle')(alumno,$scope.moodleusers) )	{
								createUserPromise.push(moodleFactory.createUser(alumno.usuario.toLowerCase(),PROPERTIES.MOODLE_USER_DEFAULT_NAME,alumno.nombres,alumno.apellido,alumno.email));
							}
					});

					angular.forEach(comision.docentes, function (docente) {
						if (!docente.docente.usuario) {
							logError('Docente de SIU sin campo usuario asignado, se omite sincronizacion de dicho docente ('+docente.docente.apellido+', '+docente.docente.nombres+')',"app.createUserPromise (docente)",docente);
						}
						else
							if ( !$filter('userExistInMoodle')(docente.docente,$scope.moodleusers) )	{
								createUserPromise.push(moodleFactory.createUser(docente.docente.usuario.toLowerCase(),"@1B2c3D4",docente.docente.nombres,docente.docente.apellido,docente.docente.email));
							}
					});

				logInfo('Se van a crear '+createUserPromise.length+' nuevos usuarios en moodle');

				//Actualizo mapa de moodle
				$q.all(createUserPromise).then(function (data){
					angular.forEach(data, function(myItem){ 
						if (!myItem.data.exception){
							$scope.moodleusers.push(myItem.data[0]);

						}
						else{
							logError('Error al crear usuario '+myItem.config.data.users[0].username+': '+myItem.data.debuginfo,"moodleFactory.createUser",myItem);
						}
							

					});
					//1.2
					var assignRolePromises = [];
					var cAlumnos = 0;
					var cDocentes = 0;

						angular.forEach(comision.alumnos, function (alumno) {
							//Omito usuarios de siu sin username
							if ( alumno.usuario && !$filter('estudianteMigrated')(alumno,comision.nombre,moodleCourse) )	{
								//userid: lo saco de los usuarios de moodle
								var user = getMoodleUserByUsername(alumno.usuario);
								if (user != null){
									cAlumnos++;
									assignRolePromises.push(moodleFactory.enrolStudent(user.id,moodleCourse.id));
								}
								else
									logError('Error al asignar usuario a curso, el usuario no existe en moodle',"moodleFactory.enrolStudent",alumno)


							}

						});


						angular.forEach(comision.docentes, function (docente) {
							//Omito usuarios de siu sin username
							if (docente.docente.usuario && !$filter('docenteMigrated')(docente.docente,comision.nombre,moodleCourse) )	{

								//userid: lo saco de los usuarios de moodle
								var user = getMoodleUserByUsername(docente.docente.usuario);
								if (user != null){
									cDocentes++;
									assignRolePromises.push(moodleFactory.enrolTeaching(user.id,moodleCourse.id));
								}
								else
									logError('Error al asignar usuario a curso, el usuario no existe en moodle',"moodleFactory.enrolTeaching",docente)


							}

						});

					logInfo('Se agregan '+cAlumnos+' nuevos estudiantes en moodle');
					logInfo('Se agregan '+cDocentes+' nuevos docentes en moodle');


					$q.all(assignRolePromises).then(function (data){
						angular.forEach(data, function(myItem){ 
							if (myItem.data)
								logError('Error al asignar usuario a curso','moodleFactory.enrolStudent',myItem);
						});


						//1.3
						var addStudentToGroupPromises = [];
						var addTeachingToGroupPromises = [];

							var cAlumnos = 0;
							var cDocentes = 0;

							angular.forEach(comision.alumnos, function (alumno) {
								//Omito usuarios de siu sin username
								if (  alumno.usuario && !$filter('estudianteMigrated')(alumno,comision.nombre,moodleCourse) )	{
									var user = getMoodleUserByUsername(alumno.usuario);
									if (user != null) {
										var group = getMoodleGroupByComision(comision.nombre,moodleCourse);
										addStudentToGroupPromises.push(moodleFactory.addGroupMember(group.id,user.id));
									}
									else
										logError('Error al asignar usuario a grupo, el usuario no existe en moodle',"moodleFactory.addGroupMember",alumno)

								}
							});

							angular.forEach(comision.docentes, function (docente) {
								//Omito usuarios de siu sin username
								if ( docente.docente.usuario && !$filter('docenteMigrated')(docente.docente,comision.nombre,moodleCourse) )	{
									var user = getMoodleUserByUsername(docente.docente.usuario);
									if (user != null) {
										var group = getMoodleGroupByComision(comision.nombre,moodleCourse);
										addTeachingToGroupPromises.push(moodleFactory.addGroupMember(group.id,user.id));
									}
									else
										logError('Error al asignar usuario a grupo, el usuario no existe en moodle',"moodleFactory.addGroupMember",docente)

								}

							});

							logInfo('Se agregan '+addStudentToGroupPromises.length+' nuevos estudiantes a la comision '+comision.nombre);
							logInfo('Se agregan '+addTeachingToGroupPromises.length+' nuevos docentes  a la comision '+comision.nombre);

						var addStudentFinishedDefer = $q.defer();
						var addStudentFinishedPromise = addStudentFinishedDefer.promise;
						$q.all(addStudentToGroupPromises).then(function (data){
							angular.forEach(data, function(myItem){ 
								if (!myItem.data){
									dummyMember = {};
									var user = getMoodleUserByID(myItem.config.data.members[0].userid);
									user.role = PROPERTIES.MOODLE_STUDENT_ROLE_ID;
									dummyMember.groupid = myItem.config.data.members[0].groupid;
									var group = getMoodleGroupById(dummyMember.groupid,moodleCourse);
									dummyMember.groupname = group.groupname;
									dummyMember.users = [user];
									addMembersToGroup(dummyMember);
								}
								else
									logError('Error al asignar usuario a grupo','moodleFactory.addGroupMember',myItem);
							});


							addStudentFinishedDefer.resolve();
						});

						var addTeachingFinishedDefer = $q.defer();
						var addTeachingFinishedPromise = addTeachingFinishedDefer.promise;
						$q.all(addTeachingToGroupPromises).then(function (data){
							angular.forEach(data, function(myItem){ 
								if (!myItem.data){
									dummyMember = {};
									var user = getMoodleUserByID(myItem.config.data.members[0].userid);
									user.role = PROPERTIES.MOODLE_TEACHING_ROLE_ID;
									dummyMember.groupid = myItem.config.data.members[0].groupid;
									var group = getMoodleGroupById(dummyMember.groupid,moodleCourse);
									dummyMember.groupname = group.groupname;
									dummyMember.users = [user];
									addMembersToGroup(dummyMember);
								}
								else
									logError('Error al asignar usuario a grupo','moodleFactory.addGroupMember',data);
							});

							addTeachingFinishedDefer.resolve();
						});

						$q.all([addTeachingFinishedPromise,addStudentFinishedPromise]).then(function (data){

							$scope.spinner = false;
							//Disparo finalizacion
							deferred.resolve('Termine');

						});
						
					});

				});

			
		});
    
	  return deferred.promise;
	};

	function _initDataComision (comision){

		initDataComisionDefer = $q.defer();

		logInfo('Comenzando la inicializacion de datos para comision: '+comision.nombre+'...');
		$scope.spinner = true;
		

	    //Itero sobre todos las actividades y obtengo los docentes/estudiantes
	    var docentesPromise = [];
	    var estudiantesPromise = [];
			
		docentesPromise.push (siuFactory.getDocentes(comision.comision));
		estudiantesPromise.push (siuFactory.getAlumnos(comision.comision));
		    
		var docentesSiuFinishedDefer = $q.defer();
		var docentesSiuFinishedPromise = docentesSiuFinishedDefer.promise;
		var cDocentes = 0;
		$q.all(docentesPromise).then(function(data) {
			for (i=0 ; i<data.length ; i++){
				cDocentes += data[i].data.length;
				if (data[i].data.length > 0)
					addProfesorsToComision(data[i].data,data[i].config.data.comision);
			}
			docentesSiuFinishedDefer.resolve();
		});

		var estudiantesSiuFinishedDefer = $q.defer();
		var estudiantesSiuFinishedPromise = estudiantesSiuFinishedDefer.promise;
		var cAlumnos= 0;
		$q.all(estudiantesPromise).then(function(data) {	
			for (i=0 ; i<data.length ; i++){
				if (data[i].data.length > 0)
					addStudentsToComision(data[i].data,data[i].config.data.comision);
			}
			estudiantesSiuFinishedDefer.resolve();
		});

		$q.all([docentesSiuFinishedPromise,estudiantesSiuFinishedPromise]).then(function (data){
			$scope.spinner = false;
			initDataComisionDefer.resolve();
		});

		return initDataComisionDefer.promise;
	
	}


    //Sincronizar Actividad <-> Curso
	$scope.synchronizeCourse = function (siuActividad){
		_synchronizeActividadSinchronized(siuActividad).then(function (data){
			logSuccess('Finalizada migracion de actividad: '+siuActividad.codigo);
		});
	}

	//Bulk Sincronizar Actividad <-> Curso
	$scope.bulkSynchronizeCourses = function (){
		var queue = [];
		angular.forEach($scope.actividades, function(actividad){ 
			if (actividad.selected && actividad.migrado && actividad.dataInitialized)
				queue.push(actividad);
		})
		synchronizeQueue(queue,0);
	}

	function synchronizeQueue(queue,curr){
		if (curr < queue.length)
			_synchronizeActividadSinchronized(queue[curr]).then(function (){
				logSuccess('Finalizada sincronizacion de actividad: '+queue[curr].codigo);
				synchronizeQueue(queue,curr+1);
			});
		return;
	}

	function _synchronizeComisionQueue(queue,curr,codigoActividad,periodoActividad,defer){
    	
			_synchronizeComision(queue[curr],codigoActividad,periodoActividad).then(function (){
				logSuccess('Finalizada sincronizacion de comision: '+queue[curr].nombre);
				if (curr == queue.length-1)
					defer.resolve();
				else
					_synchronizeComisionQueue(queue,curr+1,codigoActividad,periodoActividad,defer);
			});
		return;
    }

	//Crear Curso
	$scope.importCourse = function(siuActividad,categoria){
		_importCourse(siuActividad,categoria).then(function (data){
			logSuccess('Finalizada importacion de actividad: '+siuActividad.codigo);
		});
	}

	//Bulk crear curso
	$scope.bulkImportCourses = function (){
		var queue = [];
		angular.forEach($scope.actividades, function(actividad){ 
			if (actividad.selected && !actividad.migrado)
				queue.push(actividad);
		})
		importQueue(queue,0);
	}

	function importQueue(queue,curr){
		if (curr < queue.length)
			_importCourse(queue[curr],queue[curr].moodleCategoryID).then(function (){
				logSuccess('Finalizada importacion de actividad: '+queue[curr].codigo);
				importQueue(queue,curr+1);
			});
		return;
	}

	var getMoodleCategoryID = function (codigoActividad,parent,periodo) {
		for(var i = 0; i<$scope.moodlecourses.length; i++){
			if ($filter('actividadEquals')(codigoActividad,$scope.moodlecourses[i].shortname,periodo)){
				if (parent)	
					return 	getParentCategory($scope.moodlecourses[i].categoryid);
				else
					return 	$scope.moodlecourses[i].categoryid;
			}
		}
		return null;
	};

	var getMoodleCourseID = function (codigoActividad,periodoActividad) {
		for(var i = 0; i<$scope.moodlecourses.length; i++){
			if ($filter('actividadEquals')(codigoActividad,$scope.moodlecourses[i].shortname,periodoActividad) )
				return 	$scope.moodlecourses[i].id;
		}
		return 0;
	};

	var getMoodleCourseByActividad = function (codigoActividad,periodoActividad) {
		for(var i = 0; i<$scope.moodlecourses.length; i++){
			if ($filter('actividadEquals')(codigoActividad,$scope.moodlecourses[i].shortname,periodoActividad))
				return 	$scope.moodlecourses[i];
		}
		return null;
	};

	var getMoodleGroupByComision = function (comisionSiu,cursoMoodle) {
		for(var i = 0; i<cursoMoodle.comisiones.length; i++){
			if (cursoMoodle.comisiones[i].name == comisionSiu)
				return 	cursoMoodle.comisiones[i];
		}
		return null;
	};

	var getMoodleGroupById = function (groupid,cursoMoodle) {
		for(var i = 0; i<cursoMoodle.comisiones.length; i++){
			if (cursoMoodle.comisiones[i].id == groupid)
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
	    		}

	    	}
	    }
	}

	var addProfesorsToComision = function(profesors,idcomision){
	    for (i = 0; i < $scope.actividades.length ; i++){
	    	for ( j = 0 ; j< $scope.actividades[i].comisiones.length ; j++) {
	    		if ($scope.actividades[i].comisiones[j].comision == idcomision){
	    			$scope.actividades[i].comisiones[j].docentes = profesors;
	    		}

	    	}
	    }
	}



	var addGroupsToCourse = function(groups){
	    for (i = 0; i < $scope.moodlecourses.length ; i++){
	    	if ( $scope.moodlecourses[i].id == groups[0].courseid) {
	    		if ($scope.moodlecourses[i].comisiones)
	    			$scope.moodlecourses[i].comisiones.push(groups[0])
	    		else
	    			$scope.moodlecourses[i].comisiones = groups;
	    	}
	    }
	}

	var addMembersToGroup = function(members){
		for (m = 0 ; m < members.length ; m++){
		    for (i = 0; i < $scope.moodlecourses.length ; i++){
		    	if ($scope.moodlecourses[i].comisiones){
			    	for (j = 0; j<$scope.moodlecourses[i].comisiones.length ; j++){
			    		if ( $scope.moodlecourses[i].comisiones[j].id == members[m].groupid) {
			    			for ( h = 0 ; h < members[m].users.length ; h++){
				    			//Es alumno?
				    			if (  members[m].users[h].role == PROPERTIES.MOODLE_STUDENT_ROLE_ID ){
				    				if (!$scope.moodlecourses[i].comisiones[j].estudiantes)
						    				$scope.moodlecourses[i].comisiones[j].estudiantes = [];
						    			$scope.moodlecourses[i].comisiones[j].estudiantes.push(members[m].users[h]);
				    			}

				    			//Asumo que es docente (Puede ser con o sin permisos)
				    			else {
				    				if (!$scope.moodlecourses[i].comisiones[j].docentes)
						    				$scope.moodlecourses[i].comisiones[j].docentes = []
						    		$scope.moodlecourses[i].comisiones[j].docentes.push(members[m].users[h]);
				    			}
				    		}

				    	}
			    	}
			    }
		    	
		    }
		}
	}

	var getImportCategory = function(categoryid){
		for (i = 0 ; i < $scope.subCategoriasUnaj.length ; i++){
    		if ( $scope.subCategoriasUnaj[i].parent == categoryid && $scope.subCategoriasUnaj[i].name == PROPERTIES.MOODLE_IMPORT_CATEGORY_NAME)
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
    		if ( $scope.subCategoriasUnaj[i].id == importCategoyid){
    			if ( $scope.subCategoriasUnaj[i].parent == PROPERTIES.MOODLE_ROOT_CATEGORY_ID ){
	    			return $scope.subCategoriasUnaj[i].id;
    			}
	    		else{
	    			return getParentCategory($scope.subCategoriasUnaj[i].parent);
	    		}
	    	}
		}
		return 0;
	}
	
	//Inicializo Table Params
	$scope.tableParams = new ngTableParams({}, resetTableParams());
	
	$scope.checkAll = function () {
		if ($scope.selectedAll) {
		    $scope.selectedAll = false;
		} else {
		    $scope.selectedAll = true;
		}
		angular.forEach($scope.actividades, function (actividad) {
		    actividad.selected = $scope.selectedAll;
		});
		$scope.tableParams.reload();

	};

	//Para agrupar actividades
	//Las actividades se distingen si pertenecen a un periodo lectivo distinto,
	// es por eso que se concatenan para formar el indice
	var indexedActivities = [];
    filterActividades = function(comision) {
        var actividadIsNew = indexedActivities.indexOf(comision.actividad.codigo+'-'+comision.periodo_lectivo.periodo_lectivo) == -1;
        if (actividadIsNew) {
            indexedActivities.push(comision.actividad.codigo+'-'+comision.periodo_lectivo.periodo_lectivo);
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



    $scope.updatePeriodo = function(){
    	//Filtro por periodo
		var comisionesFiltered = $scope.comisiones.filter(function (comision) {
		    return ( ($scope.periodoSelected.periodo_lectivo == 0 ) ||
		    		(comision.periodo_lectivo.periodo_lectivo == $scope.periodoSelected.periodo_lectivo) 
		    		);
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
			  							'codError':0,
			  							'$hideRows':true,
			  							'migrado':$filter('actividadMigrated')(comisionesFiltered[i].actividad.codigo,$scope.moodlecourses,comisionesFiltered[i].periodo_lectivo),
			  							'dataInitialized':false,
			  							'periodoLectivo':comisionesFiltered[i].periodo_lectivo,
			  							});
			  	$scope.actividades[actividadesCount].moodleCategoryID =  getMoodleCategoryID($scope.actividades[actividadesCount].codigo,true,$scope.actividades[actividadesCount].periodoLectivo);
			  	actividadesCount++;
		  	}
		actividadPos = indexedActivities.indexOf(comisionesFiltered[i].actividad.codigo+'-'+comisionesFiltered[i].periodo_lectivo.periodo_lectivo);
  		$scope.actividades[actividadPos].comisiones.push(comisionesFiltered[i]);
		
		}

		//Muestro actividades
		$scope.tableParams.reload();
    }

	//
	_initDataActivitySincronized = function (actividad){
		var initDataActivitySincronizedDefer = $q.defer();
		var initDataComisionSincronizedDefer = $q.defer();
		var initDataComisionSincronizedPromise = initDataComisionSincronizedDefer.promise;


		var queue = [];
		angular.forEach(actividad.comisiones, function(comision){ 
		if (comision.selected)
			queue.push(comision);
		});

		_initDataQueue(queue,0,initDataComisionSincronizedDefer);
		initDataComisionSincronizedPromise.then( function(data){
			actividad.dataInitialized = true;
			initDataActivitySincronizedDefer.resolve()
		});

		return initDataActivitySincronizedDefer.promise;
	}

	function _initDataQueue(queue,curr,defer){
		_initDataComision(queue[curr]).then(function (){
			logSuccess('Finalizada inicializacion de comision: '+queue[curr].nombre,'_initDataQueue',queue[curr]);
			if (curr == queue.length-1)
				defer.resolve();
			else
				_initDataQueue(queue,curr+1,defer);
		});
	}

	$scope.initDataActivitySincronized = function (actividad){
		_initDataActivitySincronized(actividad).then( function(data){
			logSuccess('Finalizada inicializacion de actividad: '+actividad.nombre);
		});
	}

	function _initDataActivityQueue(queue,curr){
		if (curr < queue.length)
			_initDataActivitySincronized(queue[curr]).then(function (){
				logSuccess('Finalizada inicializacion de la actividad: '+queue[curr].nombre,queue[curr]);
			});
	}

	//Inicializar actividad
	$scope.bulkInitDataActivitySincronized = function (){
		var queue = [];
		angular.forEach($scope.actividades, function(actividad){ 
			if (actividad.selected && actividad.migrado)
				queue.push(actividad);
		})
		_initDataActivityQueue(queue,0);
	}

});
