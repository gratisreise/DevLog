package org.bitcamp.devlog.service;

import lombok.RequiredArgsConstructor;
import org.bitcamp.devlog.dto.Account;
import org.bitcamp.devlog.dto.Oauth2User;
import org.bitcamp.devlog.mapper.AccountMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountMapper accountMapper;

    public void save(Account account) {
        accountMapper.save(account);

    }
    public void update(Account account) {
        System.out.println("AccountServiceUpdate:" + account);
        accountMapper.update(account);
    }

    public String findByEmail(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(email);;
        Account account = accountMapper.findByEmail(email);

        if(account.getBlogId() == null){
            return "redirect:/loginForm";
        } else {
            return "redirect:/home";
        }
    }
    public boolean countByHomePage(String homepage){
        if(accountMapper.countByHomePage(homepage) >= 1){
            return true;
        }
        return false;
    }

    public String accountCheck(){
        String sessionEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (sessionEmail == null) {
            return null;
        }

        return accountMapper.findByEmail(sessionEmail).getHomepage();
    }

    public List<Account> findAll()
    {
        return accountMapper.findAll();
    }

    public String findNameByAccountId(long accountId){
        return  accountMapper.findNameByAccountId(accountId);
    }

    //마이페이지 댓글리스트
    public String findFileByAccountId(){
        Oauth2User oauth2User = (Oauth2User) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
        return accountMapper.findFileByAccountId(oauth2User.getAccountId());
    }

    public List<Account> findAllOrderByCreatedAt() {
        return accountMapper.findAllOrderByCreatedAt();
    }
}
