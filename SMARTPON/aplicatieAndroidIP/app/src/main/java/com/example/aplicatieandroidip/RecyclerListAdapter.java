package com.example.aplicatieandroidip;

import static androidx.core.content.ContentProviderCompat.requireContext;

import android.app.AlertDialog;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import androidx.annotation.NonNull;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

public class RecyclerListAdapter extends RecyclerView.Adapter<RecyclerListAdapter.ViewHolder> {

    private final List<Pacient> pacientList;
    private final Context context;
    NavController navController;

    public RecyclerListAdapter(Context context, List<Pacient> pacientList)
    {
        this.context = context;
        this.pacientList = pacientList;
    }

    @NonNull
    @Override
    public RecyclerListAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        //inflate row

        View view = LayoutInflater.from(context).inflate(R.layout.item_pacient, parent ,false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerListAdapter.ViewHolder holder, int position) {
        //assign values based on position
        Pacient pacient = pacientList.get(position);
        holder.name.setText(pacient.getPacientName());
        holder.id.setText(context.getString(R.string.PacientID,pacient.getPacientID()));
        holder.image.setImageResource(pacient.getPacientImage());

        holder.itemView.setOnClickListener(v -> {
            PopupMenu menu = new PopupMenu(context, v);
            menu.getMenuInflater().inflate(R.menu.pacient_options, menu.getMenu());
            menu.setOnMenuItemClickListener(item -> {
                if(item.getItemId() == R.id.menu_view_details) {
                    // Navigate to Details
                    Bundle args = new Bundle();
                    args.putString("cnp", pacient.getPacientID());

                    navController = Navigation.findNavController(v);
                    navController.navigate(R.id.action_HomeFragment_to_PacientDetailsFragment, args);
                    return true;
                }
                else if(item.getItemId() == R.id.menu_order_robot) {
                    // Navigate to BluetoothFrag
                    Bundle args = new Bundle();
                    args.putString("name", pacient.getPacientName());
                    args.putString("cnp", pacient.getPacientID());
                    args.putString("phoneNo", pacient.getPacientPhoneNo());
                    args.putString("id_pat", pacient.getPacientPat());

                    navController = Navigation.findNavController(v);
                    navController.navigate(R.id.action_HomeFragment_to_AutomaticOrderFragment, args);
                    return true;
                }
                else
                    return false;
            });
            menu.show();
        });
    }

    @Override
    public int getItemCount() {
        //total items
        return pacientList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder{
        //grabs the views from row layout

        ImageView image;
        TextView name, id;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.pacient_name);
            id = itemView.findViewById(R.id.pacient_id_value);
            image = itemView.findViewById(R.id.pacient_image);
        }
    }
}
