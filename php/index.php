<?php
$token_file = 'KZKzuDPNxm5Mxrbw';

function renderJSON($code = 0, $data = [], $msg = '') {
  exit(json_encode([
    'code' => $code,
    'data' => $data,
    'msg' => $msg
  ], JSON_UNESCAPED_UNICODE));
}

$token = $_POST['token'] ?? '';
$mechine_code = $_POST['mechine_code'] ?? '';

if(!$token || !$mechine_code) {
  renderJSON(-1, [], '缺少关键信息');
}

$token_data = file_get_contents($token_file);

$token_data = @json_decode($token_data, true);

if(!isset($token_data[$token])) {
  renderJSON(-1, [], '密钥不正确，请重试');
}

$token_info = $token_data[$token];

if(strtotime($token_info['expired_time']) <= time()) {
  renderJSON(-1, [], '已过授权有效期');
}

$token_data[$token]['mechine_code'] = $mechine_code;
file_put_contents($token_file, json_encode($token_data));

renderJSON(0, $token_data[$token]);