package com.example.aplicatieandroidip;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import java.util.ArrayList;
import java.util.List;



public class HomeFragment extends Fragment {

    private static final String TAG="HomeFragment";
    List<Pacient> pacientList = new ArrayList<>();
    String username;
    String token;
    private ProgressBar progressBar;
    RecyclerListAdapter adapter;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SharedPreferences prefs = requireActivity().getSharedPreferences("LoginPreferences", Context.MODE_PRIVATE);
        username = prefs.getString("Username", null);
        token = prefs.getString("Access_token", null);
        if (token != null) {
            fetchPacients(token);
        } else {
            progressBar.setVisibility(View.GONE);
            Toast.makeText(getContext(), "No token found", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        View view = inflater.inflate(R.layout.fragment_principal, container, false);
        progressBar = view.findViewById(R.id.progressBarLoading);
        progressBar.setVisibility(View.VISIBLE);

        RecyclerView recyclerView = view.findViewById(R.id.homeRecyclerView);
        if(adapter != null) {
            progressBar.setVisibility(View.GONE);
            recyclerView.setAdapter(adapter);
            recyclerView.setLayoutManager(new LinearLayoutManager(this.getContext()));
        }

        TextView welcomeText = view.findViewById(R.id.tvWelcome);
        welcomeText.setText("Welcome, " + username + "\nHere is your data:");
        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }


    private void fetchPacients(String token){
        new Thread(() ->{
            try{
                Log.d(TAG, "Starting GET /api/pacients request");

                URL url = new URL("http://132.220.27.51/angajati/medic/");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");

                conn.setRequestProperty("Accept", "application/json");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                int responseCode = conn.getResponseCode();
                Log.d(TAG, "Response code: " + responseCode);

                InputStream stream = (responseCode >= 200 && responseCode < 300) ? conn.getInputStream() : conn.getErrorStream();

                BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }

                Log.d(TAG, "Raw response: " + response.toString());


                JSONArray pacientArray = new JSONArray(response.toString());

                for (int i = 0; i < pacientArray.length(); i++) {
                    JSONObject obj = pacientArray.getJSONObject(i);
                    Pacient p = new Pacient(
                            obj.optString("nume", "") + " " + obj.optString("prenume", ""),
                            obj.optString("CNP", ""),
                            // adjust fields based on actual response
                            R.drawable.ic_pacienticon,
                            obj.optString("telefon", ""),
                            obj.optString("id_pat", "")
                    );

                    Log.d(TAG, "Parsed pacient: " + p.toString());
                    pacientList.add(p);
                }

                requireActivity().runOnUiThread(() ->{
                    Log.d(TAG, "Updating RecyclerView with " + pacientList.size() + " pacients");
                                                                    // setUpPacientList();
                    progressBar.setVisibility(View.GONE);
                    RecyclerView recyclerView = requireView().findViewById(R.id.homeRecyclerView);
                    adapter = new RecyclerListAdapter(this.getContext(), pacientList);
                    recyclerView.setAdapter(adapter);
                    recyclerView.setLayoutManager(new LinearLayoutManager(this.getContext()));
                });
            } catch (Exception e) {
                e.printStackTrace();
                requireActivity().runOnUiThread(() ->{
                        progressBar.setVisibility(View.GONE);
                        Toast.makeText(getContext(), "Failed to fetch pacients", Toast.LENGTH_SHORT).show();
                });
            }
        }).start();
    }
}