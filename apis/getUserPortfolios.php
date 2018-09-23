<?php
header('Content-Type: application/json');

$obj = (object) [
    'portfolios' => [
      (object) [
        id => '1',
        name => 'My Teck Stocks',
        cash => '40%',
        stock => '60%',
        total => '$647,378,832'
      ],
      (object) [
        id => '2',
        name => 'My Health Stocks',
        cash => '25%',
        stock => '75%',
        total => '$784,937'
      ],
      (object) [
        id => '3',
        name => 'My Safe Stocks',
        cash => '90%',
        stock => '10%',
        total => '$1,902,832'
      ]
    ]
];

echo json_encode($obj);
?>
