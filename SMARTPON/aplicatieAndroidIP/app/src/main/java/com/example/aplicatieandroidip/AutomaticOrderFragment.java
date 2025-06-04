package com.example.aplicatieandroidip;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;


public class AutomaticOrderFragment extends Fragment {

    private TextView tvPacientName, tvPacientCnp, tvPacientPhoneNo;
    private LinearLayout medicineListContainer;
    private Button confirmButton, cancelButton;
    private String name, cnp, phoneNo, token, idPat, time, timestamp;
    private int idPrescriptie;
    NavController navController;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences prefs = requireActivity().getSharedPreferences("LoginPreferences", Context.MODE_PRIVATE);
        name = getArguments() != null ? getArguments().getString("name") : "";
        cnp = getArguments() != null ? getArguments().getString("cnp") : "";
        phoneNo = getArguments() != null ? getArguments().getString("phoneNo") : "";
        idPat = getArguments() != null ? getArguments().getString("id_pat") : "";
        token = prefs.getString("Access_token", null);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_automatic_order, container, false);

        tvPacientName = view.findViewById(R.id.pacient_name_order);
        tvPacientName.setText(getString(R.string.PacientName,name));
        tvPacientCnp = view.findViewById(R.id.pacient_cnp_order);
        tvPacientCnp.setText(getString(R.string.PacientID,cnp));
        tvPacientPhoneNo = view.findViewById(R.id.pacient_phone_order);
        tvPacientPhoneNo.setText(getString(R.string.PacientPhoneNo,phoneNo));

        medicineListContainer = view.findViewById(R.id.PrescriptionLayout);
        confirmButton = view.findViewById(R.id.confirm_order_button);
        cancelButton = view.findViewById(R.id.cancel_order_button);

        confirmButton.setOnClickListener(v -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(this.getContext());
            builder.setTitle("Select Order Type")
                    .setMessage("How do you want to place the order?")
                    .setPositiveButton("Automatically", (dialog, which) -> {
                        // Handle automatic ordering
                        Toast.makeText(this.getContext(), "Automatic order selected", Toast.LENGTH_SHORT).show();
                        postOrder();
                    })
                    .setNegativeButton("Manually", (dialog, which) -> {
                        // Handle manual ordering
                        Toast.makeText(this.getContext(), "Manual order selected", Toast.LENGTH_SHORT).show();
                        Bundle args = new Bundle();
                        args.putString("status", "Plasata");
                        navController = Navigation.findNavController(v);
                        navController.navigate(R.id.action_AutomaticOrderFragment_to_BluetoothFragment, args);
                        Log.d("AutomaticOrder", "Navigating to BluetoothFragment");

                    })
                    .setNeutralButton("Cancel", null)
                    .show();
        });

        cancelButton.setOnClickListener(v -> {
            NavController navController = Navigation.findNavController(v);
            navController.navigate(R.id.action_AutomaticOrderFragment_to_HomeFragment);
        });

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        fetchPrescriptions();
    }

    private void fetchPrescriptions() {
        new Thread(() -> {
            try {
                URL url = new URL("http://132.220.27.51/prescriptii/");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");
                conn.setRequestProperty("Authorization", "Bearer " + token);

                int responseCode = conn.getResponseCode();
                if (responseCode != HttpURLConnection.HTTP_OK) {
                    Log.e("AutomaticOrder", "HTTP error: " + responseCode);
                    return;
                }

                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }

                JSONArray prescriptionsArray = new JSONArray(response.toString());
                Log.d("AutomaticOrder", "Raw response:" + response.toString());
                List<String> prescriptionItems = new ArrayList<>();

                for (int i = 0; i < prescriptionsArray.length(); i++) {
                    JSONObject obj = prescriptionsArray.getJSONObject(i);
                    if (cnp.equals(obj.getString("CNP"))) {
                        idPrescriptie = obj.optInt("id_prescriptie", -1);
                        String afectiune = obj.optString("afectiune", "N/A");
                        int cantitate = obj.optInt("cantitate", 0);
                        int idMedicament = obj.optInt("id_medicament", -1);
                        String numeMedicament = fetchMedicineNameById(idMedicament);

                        prescriptionItems.add("Nume medicament: " + numeMedicament +
                                "\nAfectiune: " + afectiune +
                                "\nCantitate: " + cantitate);
                    }

                }

                requireActivity().runOnUiThread(() -> updatePrescriptionLayout(prescriptionItems));

            } catch (Exception e) {
                Log.e("AutomaticOrder", "Error fetching prescriptions", e);
            }
        }).start();
    }

    private void updatePrescriptionLayout(List<String> prescriptions) {
        LinearLayout layout = requireView().findViewById(R.id.PrescriptionLayout);
        layout.removeAllViews();

        for (String item : prescriptions) {
            TextView tv = new TextView(getContext());
            tv.setText(item);
            tv.setTextSize(16);
            tv.setPadding(24, 16, 24, 16);
            tv.setBackgroundResource(R.drawable.bg_prescription_item);
            layout.addView(tv);
        }
    }

    private String fetchMedicineNameById(int idMedicament) throws IOException, JSONException {
        URL url = new URL("http://132.220.27.51/angajati/medic/medicamente/");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + token);
        conn.setRequestProperty("Accept", "application/json");

        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }

        JSONArray medicine = new JSONArray(response.toString());
        for (int i = 0; i <= medicine.length(); i++) {
            JSONObject obj = medicine.getJSONObject(i);
            if (obj.optInt("id_medicament", -1) == idMedicament) {
                return obj.optString("denumire", "N/A");
            }
        }
        return "";
    }

    private void postOrder() {
        new Thread(() -> {
            try {
                URL url = new URL("http://132.220.27.51/comenzi"); // Adjust endpoint
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("Accept", "application/json");
                conn.setRequestProperty("Authorization", "Bearer " + token);

                conn.setDoOutput(true);

                // Current timestamp
                SimpleDateFormat fullDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
                SimpleDateFormat timeOnlyFormat = new SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault());

                timestamp = fullDateFormat.format(new Date());
                time = timeOnlyFormat.format(new Date());


                // Sample values for now
                int idAngajat = 1;

                JSONObject payload = new JSONObject();
                payload.put("id_comanda", 0); // typically ignored by server
                payload.put("ora", time);
                payload.put("data", timestamp);
                payload.put("id_angajat", idAngajat);
                payload.put("id_pat", "132");
                payload.put("status", "Plasata");
                payload.put("id_prescriptie", idPrescriptie);

                try (OutputStream os = conn.getOutputStream()) {
                    Log.d("AutomaticOrder", "Sending POST to /comenzi with payload: " + payload.toString());
                    byte[] input = payload.toString().getBytes(StandardCharsets.UTF_8);
                    os.write(input, 0, input.length);
                }

                int responseCode = conn.getResponseCode();
                Log.d("AutomaticOrder", "Order POST response code: " + responseCode);
                if (responseCode == HttpURLConnection.HTTP_CREATED || responseCode == HttpURLConnection.HTTP_OK) {
                    requireActivity().runOnUiThread(() -> {
                        Bundle args = new Bundle();
                        args.putString("name", name);
                        args.putString("time", time);
                        args.putString("status", "Plasata");
                        args.putInt("orderID", 0);

                        NavController navController = Navigation.findNavController(requireView());
                        navController.navigate(R.id.action_AutomaticOrderFragment_to_OrderStatusFragment, args);
                        Log.d("AutomaticOrder", "Navigating to OrderStatusFragment");

                    });
                }
                else if (responseCode == 307) {
                    String newUrl = conn.getHeaderField("Location");
                    Log.d("POST", "Redirecting to: " + newUrl);
                    resendPostTo(newUrl, payload.toString(), token);
                }
                else {
                    Log.e("OrderPOST", "Failed with code: " + responseCode);
                }

            } catch (Exception e) {
                Log.e("OrderPOST", "Error sending POST", e);
            }
        }).start();
    }

    private void resendPostTo(String redirectUrl, String jsonBody, String token) {
        new Thread(() -> {
            try {
                URL url = new URL(redirectUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; utf-8");
                conn.setRequestProperty("Accept", "application/json");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setDoOutput(true);

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
                }

                int responseCode = conn.getResponseCode();
                Log.d("POST-Redirect", "Response after redirect: " + responseCode);

                if (responseCode == 200 || responseCode == 201) {
                    requireActivity().runOnUiThread(() -> {
                        Bundle args = new Bundle();
                        args.putString("name", name);
                        args.putString("time", time);
                        args.putString("status", "Plasata");
                        args.putInt("orderID", 0);

                        NavController navController = Navigation.findNavController(requireView());
                        navController.navigate(R.id.action_AutomaticOrderFragment_to_OrderStatusFragment, args);
                    });
                }

            } catch (Exception e) {
                Log.e("POST-Redirect", "Error during redirected POST", e);
            }
        }).start();
    }

}