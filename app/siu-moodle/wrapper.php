<?
//Obtengo parametros post
$username = $_POST['username'];
$password = $_POST['password'];
$url = $_POST['url'];

$ch = curl_init();
// set url
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
curl_setopt($ch, CURLOPT_USERPWD, $username .":".$password);


//first authentication with a head request
curl_setopt($ch, CURLOPT_NOBODY, 1);
curl_exec($ch);        


try {

  //get the real output
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_HEADER, 1);
  curl_setopt($ch, CURLOPT_HTTPGET, 1);
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
  if ($status_code != 200)
      throw new Exception("Response with Status Code [" . $status_code . "].", 500);

} catch(Exception $ex) {
    if ($ch != null) curl_close($ch);
    throw new Exception($ex);
}

if ($ch != null) curl_close($ch);

//Prints output without header
$datastring = substr($result['response'],$result['info']['header_size']);
echo $datastring;
?>
