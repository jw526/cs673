<script type="text/javascript">
  <?php 
    include(dirname(__FILE__). '/../../libs/jquery.js');
    include(dirname(__FILE__). '/../../libs/jquery-ui.js');
    include(dirname(__FILE__). '/../../libs/bootstrap/js/bootstrap.min.js');
  ?>
</script>
<script type="text/javascript">
  <?php 
    include(dirname(__FILE__). '/../../controllers/app.js');
    include(dirname(__FILE__). '/../../controllers/user.js');
    include(dirname(__FILE__). '/../../controllers/portfolios.js');
  ?>

    $( function() {
    var availableTags = [
      'MMM: 3M',
      'AXP: American Express',
      'AAPL: Apple',
      'BA: Boeing',
      'CAT: Caterpillar',
      'CVX: Chevron',
      'CSCO: Cisco',
      'KO: Coca-Cola',
      'DIS: Disney',
      'DWDP: DowDuPont Inc',
      'XOM: Exxon Mobil',
      'GS: Goldman Sachs',
      'HD: Home Depot',
      'IBM: IBM',
      'INTC: Intel',
      'JNJ: Johnson &amp; Johnson',
      'JPM: JPMorgan Chase',
      'MCD: McDonald\'s',
      'MRK: Merck',
      'MSFT: Microsoft',
      'NKE: Nike',
      'PFE: Pfizer',
      'PG: Procter &amp; Gamble',
      'TRV: Travelers Companies Inc',
      'UTX: United Technologies',
      'UNH: UnitedHealth',
      'VZ: Verizon',
      'V: Visa',
      'WMT: Wal-Mart',
      'WBA: Walgreen'
    ];
    $( "#search-input-feild" ).autocomplete({
      source: availableTags
    });
  } );
</script>