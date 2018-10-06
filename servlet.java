import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.*;
import java.io.*;

public class HelloWorld extends HttpServlet {

  public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    response.setContentType("application/json");

    String ticket = request.getParameter("ticket");

    URL url = new URL("https://finance.yahoo.com/lookup?s=" + ticket);
    URLConnection connection = url.openConnection();
    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));

    String inputLine;
    while ((inputLine = in.readLine()) != null) {

      String identifyer = ticket.toLowerCase() + "</a>";
      String line = inputLine.toLowerCase();

      if (line.indexOf(identifyer) != -1) {
        int indexOfIdentifyer = line.indexOf(identifyer);

        String lineWithPrice = line.substring(indexOfIdentifyer, indexOfIdentifyer + 200);

        String[] array = lineWithPrice.split("</td>");

        String dirtyPrice = array[2];

        String[] array2 = dirtyPrice.split(">");
        // System.out.println();

        response.getWriter().append("{ price: " + array2[1] + "}");
      }
    }

    in.close();

  }// end doGet

}
