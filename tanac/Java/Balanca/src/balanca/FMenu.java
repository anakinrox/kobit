/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package balanca;


import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.swing.JOptionPane;


/**
 *
 * @author Marcio
 */

public class FMenu extends javax.swing.JFrame {
    
    public static String lerArquivo() {
        try {
            Path caminho = Paths.get("c:/temp/peso.txt");         
            byte[] texto = Files.readAllBytes(caminho);
            String leitura = new String(texto);                 

            return leitura;            
        } catch(Exception erro) {
            
        }
    return "";
    }    

    /**
     * Creates new form FMenu
     */
    public FMenu() {
        initComponents();
        
	DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
	Date date = new Date();         
        lbl_data.setText(dateFormat.format(date));
        

      
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        lbl_data = new javax.swing.JLabel();
        btn_loadPlaca = new javax.swing.JButton();
        numPlaca = new javax.swing.JTextField();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Entrada Matéria Prima");
        setAlwaysOnTop(true);
        setResizable(false);
        addWindowListener(new java.awt.event.WindowAdapter() {
            public void windowActivated(java.awt.event.WindowEvent evt) {
                formWindowActivated(evt);
            }
            public void windowOpened(java.awt.event.WindowEvent evt) {
                formWindowOpened(evt);
            }
        });

        lbl_data.setText("14/10/2022");
        lbl_data.setToolTipText("");

        btn_loadPlaca.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagens/truck16.png"))); // NOI18N
        btn_loadPlaca.setText("Conectar LDAP");
        btn_loadPlaca.setToolTipText("");
        btn_loadPlaca.setName(""); // NOI18N
        btn_loadPlaca.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btn_loadPlacaActionPerformed(evt);
            }
        });

        numPlaca.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                numPlacaKeyReleased(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
            .addGroup(layout.createSequentialGroup()
                .addGap(244, 244, 244)
                .addComponent(numPlaca, javax.swing.GroupLayout.PREFERRED_SIZE, 112, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(btn_loadPlaca)
                .addContainerGap(283, Short.MAX_VALUE))
            .addGroup(layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(lbl_data, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(lbl_data)
                .addGap(186, 186, 186)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btn_loadPlaca, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(numPlaca, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(232, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void formWindowActivated(java.awt.event.WindowEvent evt) {//GEN-FIRST:event_formWindowActivated
        // TODO add your handling code here:

    }//GEN-LAST:event_formWindowActivated

    private void formWindowOpened(java.awt.event.WindowEvent evt) {//GEN-FIRST:event_formWindowOpened
        // TODO add your handling code here:
                
    }//GEN-LAST:event_formWindowOpened

    private void btn_loadPlacaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btn_loadPlacaActionPerformed
        // TODO add your handling code here:
        if (numPlaca.getText().length() == 0) {
         JOptionPane.showMessageDialog(null, "Campo Placa não informado");
         return;
        }
        
    LdapContext ctx = null;
    Hashtable<String, String> env = new Hashtable <String, String>();
    try{
        env.clear();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.SECURITY_PRINCIPAL, "user");
        env.put(Context.SECURITY_CREDENTIALS, "password");
        env.put(Context.SECURITY_PROTOCOL, "ssl");
        env.put("com.sun.jndi.ldap.read.timeout", 5000);
        env.put("com.sun.jndi.ldap.connect.timeout", 5000);
        env.put(Context.PROVIDER_URL, "myurl");
        ctx = new InitialLdapContext(env, null);
    } catch(NamingException nex) {
        // Errors get treated here
    }
    int debug_stop = 1;
        
    }//GEN-LAST:event_btn_loadPlacaActionPerformed

    private void numPlacaKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_numPlacaKeyReleased
        // TODO add your handling code here:
        int position = numPlaca.getCaretPosition();
        if (position == 3) {
            numPlaca.setText(numPlaca.getText().toUpperCase() + "-");
            numPlaca.setCaretPosition(position +1); 
        } else {
            numPlaca.setText(numPlaca.getText().toUpperCase());
            numPlaca.setCaretPosition(position); 
        }
        
               
    }//GEN-LAST:event_numPlacaKeyReleased

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Windows".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(FMenu.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(FMenu.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(FMenu.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(FMenu.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new FMenu().setVisible(true);
            }
        });
        

    }
    

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btn_loadPlaca;
    private javax.swing.JLabel lbl_data;
    private javax.swing.JTextField numPlaca;
    // End of variables declaration//GEN-END:variables
}
