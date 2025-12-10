package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Service.AuthenticationService;
import com.Project.Bookstore.dto.AuthenticationRequest;
import com.Project.Bookstore.dto.AuthenticationResponse;
import com.Project.Bookstore.dto.IntrospectRequest;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<?>  login(@RequestBody AuthenticationRequest authenticationRequest) {
        try{
             var result =  authenticationService.authenticate(authenticationRequest);
             return ResponseEntity.ok(result);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
    @PostMapping("/introspect")
    public ResponseEntity<?>  introspect(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        try{
            var result =  authenticationService.introspect(request);
            return ResponseEntity.ok(result);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
