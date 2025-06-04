package com.example.aplicatieandroidip;

import android.app.AlertDialog;
import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class OrderStatusFragment extends Fragment {

    private Handler handler = new Handler(Looper.getMainLooper());
    private Runnable statusChecker;
    private int orderId;
    private String name, time, status, token;
    private boolean arrived = false;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Bundle args = getArguments();
        if (args != null) {
            name = args.getString("name");
            time = args.getString("time");
            status = args.getString("status");
            orderId = args.getInt("orderID");

            token = getContext().getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE).getString("access_token", null);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_order_status, container, false);
        TextView title = view.findViewById(R.id.orderTitle);
        TextView placedTime = view.findViewById(R.id.orderPlaced);

        title.setText(getString(R.string.OrderTitle,name));
        placedTime.setText(getString(R.string.OrderPlaced,time));

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        statusChecker = new Runnable() {
            @Override
            public void run() {
                checkOrderStatus();
                handler.postDelayed(this, 5000); // poll every 5 seconds
            }
        };

        handler.post(statusChecker);

    }

    private void checkOrderStatus() {
        new Thread(() -> {
            try {
                URL url = new URL("http://132.220.27.51/comenzi/status");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");
                conn.setRequestProperty("Authorization", "Bearer " + token);

                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }

                JSONObject orderJson = new JSONObject(response.toString());
                status = orderJson.getString("status");
                String now = new SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(new Date());

                requireActivity().runOnUiThread(() -> updateStatusUI(status, now));

            } catch (Exception e) {
                Log.e("StatusCheck", "Error fetching order", e);
            }
        }).start();
    }

    private void updateStatusUI(String status, String time) {
        switch (status) {
            case "Plasata":
                TextView tv = requireView().findViewById(R.id.orderPlaced);
                tv.setText(getString(R.string.OrderPlaced,time));
                break;
            case "InProcesare":
                tv = requireView().findViewById(R.id.orderProcessed);
                tv.setText(getString(R.string.OrderProcessed,time));
                break;
            case "InTranzit":
                tv = requireView().findViewById(R.id.orderTransit);
                tv.setText(getString(R.string.OrderTransit,time));
                break;
            case "Livrata":
                if (!arrived) {
                    tv = requireView().findViewById(R.id.orderFinish);
                    tv.setText(getString(R.string.OrderFinished,time));
                    showArrivalPopup();
                    arrived = true;
                    handler.removeCallbacks(statusChecker); // stop polling
                }
                break;
        }
    }


    private void showArrivalPopup() {
        new AlertDialog.Builder(requireContext())
                .setTitle("Order Complete")
                .setMessage("Your Order has arrived!")
                .setPositiveButton("OK", null)
                .show();

        Button goHomeBtn = requireView().findViewById(R.id.btnGoHome);
        goHomeBtn.setVisibility(View.VISIBLE);
        goHomeBtn.setOnClickListener(v ->
                Navigation.findNavController(requireView()).navigate(R.id.action_OrderStatusFragment_to_HomeFragment)
        );
    }
}