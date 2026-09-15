import java.util.Scanner;

public class soutIn {
    static void main() {
//        IO.println("elso pelda");
//        System.out.println("masodik");
//        int number = 1;
//        System.out.println("a number erteke: "+ number);
//        System.out.println("Kozbulso sor.");
//        System.out.printf("a number erteke %d",number);
        Scanner sc = new Scanner(System.in);
//        System.out.println("Kerek egy nevet: ");
//        String name = sc.next();
//        System.out.println(name);
//        System.out.println("Kerem a teljes neved: ");
//        String names = sc.nextLine();
//        System.out.println(names);
//        System.out.println("Kerek egy egesz szamot:");
//        int egesz = sc.nextInt();
//        System.out.println(egesz);
//        System.out.println("kerek egy tizedes szamot:");
//        double tizedes = sc.nextDouble();
//        System.out.println("Kerek egy karaktert:");
//        char karakter = sc.next().charAt(0);
//        System.out.println(karakter);
        String msg = "I am happy today!";
        int a = 150;
        int o = 0226;
        int h = 0x96;
        double d = 10;
        System.out.println(msg);
        System.out.println(a);
        System.out.println(o);
        System.out.println(h);
        System.out.println(d);


        System.out.print("Enter your favorite song:");
        String song = sc.nextLine();
        System.out.print("Enter your favorite food:");
        String food = sc.nextLine();
        System.out.print("Enter your favorite hobby:");
        String hobby = sc.nextLine();
        System.out.print("Enter your favorite film:");
        String film = sc.nextLine();
        System.out.print("Enter your favorite destination:");
        String destination = sc.nextLine();

        System.out.println("favorite song:"+song);
        System.out.println("favorite food:"+food);
        System.out.println("favorite hobby:"+hobby);
        System.out.println("favorite film:"+film);
        System.out.println("favorite destination:"+destination);
    }
}
