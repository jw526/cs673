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
    include(dirname(__FILE__). '/./supportedStocks.js');
  ?>

    $( function() {
      $( "#search-input-feild" ).autocomplete({
        source: dow30.concat(indiaStocks)
      });
    });
</script>