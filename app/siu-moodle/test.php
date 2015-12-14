<?
//Obtengo parametros post
/*$username = $_POST['username'];
$password = $_POST['password'];
$method = $_POST['method'];
$parameters = $_POST['parameters'];
$url = $_POST['url'];*/

$data = array("curso" => '',"nombre" => '');
$data_string = json_encode($data);  

$ch = curl_init();
// set url
curl_setopt($ch, CURLOPT_URL, 'http://170.210.158.23/guarani/3.10/rest/cursos/test2');
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
curl_setopt($ch, CURLOPT_USERPWD, 'guarani' .":".'guarani');
//curl_setopt($ch, CURLOPT_PUT, true);

//first authentication with a head request
curl_setopt($ch, CURLOPT_NOBODY, 1);
curl_exec($ch);        


try {

  //get the real output
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_NOBODY, FALSE);
  //curl_setopt($ch, CURLOPT_HEADER, 1);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
  //curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string))                                                                       
  );   
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
  
  //curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
  $result = array();
  $result['response']         = json_decode(curl_exec($ch));
  $result['info']             = curl_getinfo ($ch);
  $result['info']['errno']    = curl_errno($ch);
  $result['info']['errmsg']   = curl_error($ch);

  // validate CURL status
  if(curl_errno($ch))
      throw new Exception(curl_error($ch), 500);

  // validate HTTP status code (user/password credential issues)
  $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

  if ($status_code != 200 || $status_code != 201 || $status_code != 204){
      var_dump( $result) ;
	echo $result['response']->error;
	echo $result['response']->mensaje;
	echo $result['response']->descripcion;
      throw new Exception("Response with Status Code [" . $status_code . ":".$result['response']->descripcion."].", 500);
}

} catch(Exception $ex) {
    if ($ch != null) curl_close($ch);
    throw new Exception($ex);
}

if ($ch != null) curl_close($ch);

//Prints output without header
var_dump($result);

?>
