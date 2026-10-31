package com.example.demo.Repository;

import com.example.demo.Model.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
// It stores data in the Favourite City Table //
public interface FavouriteRepo  extends JpaRepository<Favourite,Long>{
    Optional<Favourite> findByCityIgnoreCase(String city);
    List<Favourite> findAllByOrderByCreatedAtDesc();
}
