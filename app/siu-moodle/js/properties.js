app.constant('PROPERTIES', {
  //URI de servicios REST de SIU (Ejemplo: 'http://170.210.158.23/guarani/3.10/rest/' )
  SIU_REST_URI: 'http://170.210.158.23/guarani/3.10/rest/',

  //URI de servicios REST de MOODLE (Ejemplo: 'http://localhost/www/moodle29/webservice/rest/server.php' )
  MOODLE_REST_URI: 'https://campus.unaj.edu.ar/webservice/rest/server.php',

  //ID de la categoria principal dentro de MOODLE
  MOODLE_ROOT_CATEGORY_ID: 3,

  //ID del rol que se le da a los estudiantes
  MOODLE_STUDENT_ROLE_ID: 5,

  //ID del rol que se le da a los profesores
  MOODLE_TEACHING_ROLE_ID: 4,

  //Metodo de autenticacion con el que se generan los usuarios
  CREATE_USER_MOODLE_AUTH: 'manual',

  //Dominio del mail que se utiliza por defecto al crear un usuario
  CREATE_USER_MOODLE_EMAIL_DEFAULT: '@default.com',

  //Password por defecto que que se asigna por defecto al crear un usuario
  MOODLE_USER_DEFAULT_NAME: '@1B2c3D4',

  //Prefijo utilizado por los SHORTNAMES de los cursos creados en MOODLE
  MOODLE_COURSE_SHORTNAME_PREFIX: 'SIU-',

  //Nombre de subcategoria en la que se crean los cursos
  MOODLE_IMPORT_CATEGORY_NAME: 'Importados',

  //Limite de comisiones que se obtienen de SIU (Deprecado)
  SIU_QUERY_LIMIT: 1,

  //Prefijo de cursos creados en SIU (Deprecado)
  PREFIX: 'M-'
});
