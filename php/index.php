<?php
$token_file = 'KZKzuDPNxm5Mxrbw';

function renderJSON($code = 0, $data = [], $msg = '') {
  exit(json_encode([
    'code' => $code,
    'data' => $data,
    'msg' => $msg
  ]));
}

$token = $_REQUEST['token'] ?? '';
$machine_code = $_REQUEST['machine_code'] ?? '';

if(!$token || !$machine_code) {
  renderJSON(-1, [], '缺少关键信息');
}

$token_data = file_get_contents($token_file);

$token_data = @json_decode($token_data, true);

if(!isset($token_data[$token])) {
  renderJSON(-1, [], '密钥不正确，请重试');
}

$token_data[$token]['mechine_code'] = $machine_code;
file_put_contents($token_file, json_encode($token_data));

$token_info = $token_data[$token];

if(strtotime($token_info['expird_time']) <= time()) {
  renderJSON(-1, [], '已过授权有效期');
}

renderJSON(200, $token_data[$token]);