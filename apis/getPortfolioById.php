<?php
header('Content-Type: application/json');

$obj = (object) [
    'stocks' => [
      (object) [
        id => 'APPL',
        qty => '4',
        profit => '$543',
        currentPrice => '$200'        
      ],
      (object) [
        id => 'TEAM',
        qty => '53',
        profit => '$21',
        currentPrice => '$123'
      ],
      (object) [
        id => 'RPX',
        qty => '893',
        profit => '$1,245,432',
        currentPrice => '$0.63'
      ]
    ]
];

echo json_encode($obj);
?>
