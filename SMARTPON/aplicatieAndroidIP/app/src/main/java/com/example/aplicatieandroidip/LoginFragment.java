package com.example.aplicatieandroidip;

import android.content.Context;
import android.content.SharedPreferences;
import android.nfc.Tag;
import android.os.Bundle;
import androidx.fragment.app.Fragment;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;


public class LoginFragment extends Fragment {

    private static final String TAG="LoginFragment";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_conectare, container, false);
        Button btn = view.findViewById(R.id.button_conectare);
        TextView idInput = view.findViewById(R.id.id_conectare);
        TextView passwordInput = view.findViewById(R.id.parola_conectare);

        btn.setOnClickListener(v -> {
            String id = idInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();
            loginToCloud(id, password);
        });
        return view;
    }

    private void loginToCloud(String id, String password) {
        new Thread(() -> {
            try {
                URL url = new URL("http://132.220.27.51/login"); // adjust path
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Accept", "application/json");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                String jsonInputString = String.format("{\"username\": \"%s\", \"password\": \"%s\", \"rememberMe\": false}", id, password);
                Log.d(TAG, "Sending JSON: " + jsonInputString);

                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = jsonInputString.getBytes("utf-8");
                    Log.d(TAG, "Writing...");
                    os.write(input, 0, input.length);
                    Log.d(TAG, "Input successful");
                }

                int code = conn.getResponseCode();
                Log.d(TAG, "HTTP response code: " + code);

                InputStream responseStream = (code >= 200 && code < 300) ?
                        conn.getInputStream() : conn.getErrorStream();

                BufferedReader reader = new BufferedReader(new InputStreamReader(responseStream, "utf-8"));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line.trim());
                }
                Log.d(TAG, "Raw response: " + response.toString());

                JSONObject jsonResponse = new JSONObject(response.toString());
                Log.d(TAG, "Parsed token: " + jsonResponse.optString("access_token", "none"));
                String token = jsonResponse.optString("access_token", null);

                if (token != null && !token.isEmpty()) {
                    requireActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(), "Login successful", Toast.LENGTH_SHORT).show();

                        SharedPreferences prefs = requireActivity().getSharedPreferences("LoginPreferences", Context.MODE_PRIVATE);
                        SharedPreferences.Editor editor = prefs.edit();
                        editor.putString("Username", id).apply();
                        editor.putString("Access_token", token).apply();
                        editor.apply();

                        // Navigate to next fragment or activity
                        NavController navController = Navigation.findNavController(requireView());
                        navController.navigate(R.id.action_LoginFragment_to_HomeFragment); // adjust
                    });
                } else {
                    requireActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(), "Login failed", Toast.LENGTH_SHORT).show()
                    );
                }

            } catch (Exception e) {
                e.printStackTrace();
                requireActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(), "Error connecting to server", Toast.LENGTH_SHORT).show()
                );
            }
        }).start();
    }
}