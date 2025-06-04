package com.example.aplicatieandroidip;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;


public class PacientDetalisFragment extends Fragment {

    private String fullName, cnp, email, county, city, address, phone, jobName, jobPlace, gender, bloodGroup, rh, bedId, token;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        cnp = getArguments().getString("cnp");
        Log.d("PacientDetails", "Fetching details for CNP: " + cnp);

        fetchPacientDetails();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_pacient_detalis, container, false);
    }

    private void fetchPacientDetails() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = requireContext().getSharedPreferences("LoginPreferences", Context.MODE_PRIVATE);
                token = prefs.getString("Access_token", null);

                URL url = new URL("http://132.220.27.51/angajati/medic");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Accept", "application/json");

                Log.e("PacientDetails", "HTTP Response" + conn.getResponseCode());

                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) response.append(line);

                JSONArray pacients = new JSONArray(response.toString());
                Log.d("PacientDetails","Raw response" + response.toString());

                for (int i = 0; i < pacients.length(); i++) {
                    JSONObject obj = pacients.getJSONObject(i);
                    if(cnp.equals(obj.optString("CNP", ""))) {
                        Log.d("PacientDetails", "CNP is valid");
                        fullName = obj.optString("nume", "") + " " + obj.optString("prenume", "");
                        address = obj.optString("strada", "") + " nr. "
                                + obj.optInt("nr_strada", 0) + " sc. "
                                + obj.optString("scara", "") + " ap. "
                                + obj.optInt("apartament", -1);
                        phone = obj.optString("telefon", "");
                        email = obj.optString("email", "");
                        county = obj.optString("judet", "");
                        city = obj.optString("localitate", "");
                        jobName = obj.optString("profesie", "");
                        jobPlace = obj.optString("loc_de_munca", "");
                        gender = obj.optString("sex", "");
                        bloodGroup = obj.optString("grupa_sange", "");
                        rh = obj.optString("rh", "");
                        bedId = obj.optString("id_pat", "");
                    }
                }
                requireActivity().runOnUiThread(() -> {
                    ((TextView) requireView().findViewById(R.id.pacient_name_details)).setText(getString(R.string.PacientName,fullName));
                    ((TextView) requireView().findViewById(R.id.pacient_cnp_details)).setText(getString(R.string.PacientID,cnp));
                    ((TextView) requireView().findViewById(R.id.pacient_mail_details)).setText(getString(R.string.PacientEmail,email));
                    ((TextView) requireView().findViewById(R.id.pacient_phone_details)).setText(getString(R.string.PacientPhoneNo,phone));
                    ((TextView) requireView().findViewById(R.id.pacient_county_details)).setText(getString(R.string.PacientCounty,county));
                    ((TextView) requireView().findViewById(R.id.pacient_city_details)).setText(getString(R.string.PacientCity,city));
                    ((TextView) requireView().findViewById(R.id.pacient_address_details)).setText(getString(R.string.PacientAddress,address));
                    ((TextView) requireView().findViewById(R.id.pacient_jobName_details)).setText(getString(R.string.PacientJobName,jobName));
                    ((TextView) requireView().findViewById(R.id.pacient_jobPlace_details)).setText(getString(R.string.PacientJobWorkplace,jobPlace));
                    ((TextView) requireView().findViewById(R.id.pacient_gender_details)).setText(getString(R.string.PacientGender,gender));
                    ((TextView) requireView().findViewById(R.id.pacient_blood_details)).setText(getString(R.string.PacientBloodGroup, bloodGroup));
                    ((TextView) requireView().findViewById(R.id.pacient_rh_details)).setText(getString(R.string.PacientRH,rh));
                    ((TextView) requireView().findViewById(R.id.pacient_bed_details)).setText(getString(R.string.PacientBed,bedId));
                });

            } catch (Exception e) {
                Log.e("PacientDetails", "Error fetching pacient", e);
            }
        }).start();
    }

}