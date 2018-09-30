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
    include(dirname(__FILE__). '/../../controllers/stocks.js');
    include(dirname(__FILE__). '/./supportedStocks.js');
  ?>

    $( function() {
      $.widget( "custom.catcomplete", $.ui.autocomplete, {
      _create: function() {
        this._super();
        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
      },
      _renderMenu: function( ul, items ) {
        var that = this,
          currentCategory = "";
        $.each( items, function( index, item ) {
          var li;
          if ( item.category != currentCategory ) {
            ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
            currentCategory = item.category;
          }
          li = that._renderItemData( ul, item );
          if ( item.category ) {
            li.attr( "aria-label", item.category + " : " + item.label );
          }
        });
      }
    });

    $( "#search-input-feild" ).catcomplete({
      source: categoryDow30.concat(categoryIndiaStocks)
    });
  });

  allPagesInit();
</script>