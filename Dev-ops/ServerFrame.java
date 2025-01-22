import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ServerFrame extends JFrame {

    private JTextArea textArea;
    private JButton startButton;
    private JButton stopButton;
    private ServerSocket serverSocket;
    private boolean isRunning;
    private final int PORT = 8000;

    public ServerFrame() {
        setTitle("Server JFrame");
        setSize(600, 500);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        initComponents();
    }

    private void initComponents() {
        // Layout and components
        textArea = new JTextArea();
        textArea.setEditable(false);
        textArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        JScrollPane scrollPane = new JScrollPane(textArea);

        startButton = new JButton("Start Server");
        stopButton = new JButton("Stop Server");
        stopButton.setEnabled(false);

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(startButton);
        buttonPanel.add(stopButton);

        add(scrollPane, BorderLayout.CENTER);
        add(buttonPanel, BorderLayout.SOUTH);

        // Add button actions
        startButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                startServer();
            }
        });

        stopButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                stopServer();
            }
        });
    }

    private void startServer() {
        try {
            serverSocket = new ServerSocket(PORT);
            isRunning = true;
            logMessage("Server started on port " + PORT + "...");
            startButton.setEnabled(false);
            stopButton.setEnabled(true);

            new Thread(() -> {
                while (isRunning) {
                    try {
                        Socket clientSocket = serverSocket.accept();
                        logMessage("Client connected: " + clientSocket.getInetAddress());

                        new Thread(new ClientHandler(clientSocket)).start();

                    } catch (IOException ex) {
                        if (isRunning) {
                            logMessage("Error: " + ex.getMessage());
                        }
                    }
                }
            }).start();

        } catch (IOException ex) {
            logMessage("Failed to start server: " + ex.getMessage());
        }
    }

    private void stopServer() {
        try {
            isRunning = false;
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }
            logMessage("Server stopped.");
            startButton.setEnabled(true);
            stopButton.setEnabled(false);
        } catch (IOException ex) {
            logMessage("Error stopping server: " + ex.getMessage());
        }
    }

    private void logMessage(String message) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String timestamp = formatter.format(new Date());
        textArea.append("[" + timestamp + "] " + message + "\n");
    }

    private class ClientHandler implements Runnable {
        private Socket clientSocket;

        public ClientHandler(Socket clientSocket) {
            this.clientSocket = clientSocket;
        }

        @Override
        public void run() {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                 PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {

                String message;
                while ((message = in.readLine()) != null) {
                    logMessage("Received: " + message);
                    out.println("Echo: " + message);
                }

            } catch (IOException ex) {
                logMessage("Client error: " + ex.getMessage());
            } finally {
                try {
                    clientSocket.close();
                    logMessage("Client disconnected.");
                } catch (IOException ex) {
                    logMessage("Error closing client socket: " + ex.getMessage());
                }
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            ServerFrame frame = new ServerFrame();
            frame.setVisible(true);
        });
    }
}