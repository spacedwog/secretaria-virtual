import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class ServerFrame extends JFrame {

    private JTextArea textArea;
    private JButton startButton;
    private JButton stopButton;
    private ServerSocket serverSocket;
    private boolean isRunning;

    public ServerFrame() {
        setTitle("Server JFrame");
        setSize(500, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        initComponents();
    }

    private void initComponents() {
        // Layout and components
        textArea = new JTextArea();
        textArea.setEditable(false);
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
            serverSocket = new ServerSocket(3000);
            isRunning = true;
            textArea.append("Server started on port 3000...\n");
            startButton.setEnabled(false);
            stopButton.setEnabled(true);

            new Thread(() -> {
                while (isRunning) {
                    try {
                        Socket clientSocket = serverSocket.accept();
                        textArea.append("Client connected: " + clientSocket.getInetAddress() + "\n");

                        BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                        PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

                        String message;
                        while ((message = in.readLine()) != null) {
                            textArea.append("Received: " + message + "\n");
                            out.println("Echo: " + message);
                        }

                        clientSocket.close();
                        textArea.append("Client disconnected.\n");
                    } catch (IOException ex) {
                        if (isRunning) {
                            textArea.append("Error: " + ex.getMessage() + "\n");
                        }
                    }
                }
            }).start();

        } catch (IOException ex) {
            textArea.append("Failed to start server: " + ex.getMessage() + "\n");
        }
    }

    private void stopServer() {
        try {
            isRunning = false;
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }
            textArea.append("Server stopped.\n");
            startButton.setEnabled(true);
            stopButton.setEnabled(false);
        } catch (IOException ex) {
            textArea.append("Error stopping server: " + ex.getMessage() + "\n");
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            ServerFrame frame = new ServerFrame();
            frame.setVisible(true);
        });
    }
}