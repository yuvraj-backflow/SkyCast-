package com.example.demo.Controller;

import com.example.demo.Dto.FavouriteRequest;
import com.example.demo.Dto.FavouriteResponse;
import com.example.demo.Service.FavouriteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favourite")
public class FavouriteController {
    @Autowired
    private FavouriteService favouriteService;
    // Add To The Favourite City //
    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public FavouriteResponse addFavourite(
        @Valid
        @RequestBody
        FavouriteRequest favouriteRequest){
return favouriteService.addFavourite(favouriteRequest);
    }
    //  Fetch The Favourite City //
    @GetMapping
    public List<FavouriteResponse> getFavourites(){
        return favouriteService.getFavourites();
    }
    // Deleting The Favourite City //
    @DeleteMapping("/{id}")
    public void deleteFavourite(@PathVariable Long id){
        favouriteService.deleteFavourite(id);
    }
}
