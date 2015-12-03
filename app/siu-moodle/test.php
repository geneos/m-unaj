<?
//Obtengo parametros post
$username = $_POST['username'];
$password = $_POST['password'];
$method = $_POST['method'];
$parameters = $_POST['parameters'];
$url = $_POST['url'];

$data = array("curso" => 'curso',"nombre" => 'nombre');

$ch = curl_init();
// set url
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_URL, 'http://170.210.158.23/guarani/3.10/rest/cursos/test2');
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
curl_setopt($ch, CURLOPT_USERPWD, 'guarani' .":".'guarani');


//first authentication with a head request
curl_setopt($ch, CURLOPT_NOBODY, 1);
curl_exec($ch);        


try {

  //get the real output
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_HEADER, 1);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
  //curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
  //curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
  //curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
  $result = array();
  $result['response']         = curl_exec($ch);
  $result['info']             = curl_getinfo ($ch);
  $result['info']['errno']    = curl_errno($ch);
  $result['info']['errmsg']   = curl_error($ch);

  // validate CURL status
  if(curl_errno($ch))
      throw new Exception(curl_error($ch), 500);

  // validate HTTP status code (user/password credential issues)
  $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  if ($status_code != 200){
      var_dump( $result['info']) ;
	echo  $result['info']['errno'];
	echo $result['info']['errmsg'];
      throw new Exception("Response with Status Code [" . $status_code . "].", 500);
}

} catch(Exception $ex) {
    if ($ch != null) curl_close($ch);
    throw new Exception($ex);
}

if ($ch != null) curl_close($ch);

//Prints output without header
$datastring = substr($result['response'],$result['info']['header_size']);
echo $datastring;

echo $result['info'] ;
echo  $result['info']['errno'];
echo $result['info']['errmsg'];

?>
