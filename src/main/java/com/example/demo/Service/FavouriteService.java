package com.example.demo.Service;

import com.example.demo.Dto.FavouriteRequest;
import com.example.demo.Dto.FavouriteResponse;
import com.example.demo.Model.Favourite;
import com.example.demo.Repository.FavouriteRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FavouriteService {
    private final FavouriteRepo favouriteRepo;
    public FavouriteService(FavouriteRepo favouriteRepo) {
        this.favouriteRepo = favouriteRepo;
    }
    //add items to Favourite
    public FavouriteResponse addFavourite(FavouriteRequest  favouriteRequest) {
        String city = favouriteRequest.city().trim();
        Favourite favourite = favouriteRepo.findByCityIgnoreCase(city)
                .orElseGet(()-> favouriteRepo.save(new Favourite(city)));
return convertToDto(favourite);
    }
//fetch all favourite City in the Descending the Order //
    public List<FavouriteResponse> getFavourites() {
        return favouriteRepo.findAllByOrderByCreatedAtDesc().stream().map(this::convertToDto).toList();
    }
    //Delete City //
    public void deleteFavourite(Long favouriteId) {
         Favourite favourite = favouriteRepo.findById(favouriteId).orElseThrow(()->  new ResponseStatusException(
                HttpStatus.NOT_FOUND,"Your Favourite City is not Avaliable"));
favouriteRepo.delete(favourite);
    }

    public FavouriteResponse convertToDto(Favourite favourite) {
        return new FavouriteResponse(
                favourite.getId(),
                favourite.getCity(),
                favourite.getCreatedAt()
        );
    }
}
