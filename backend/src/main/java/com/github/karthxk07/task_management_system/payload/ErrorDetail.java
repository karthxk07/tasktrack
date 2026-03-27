package com.github.karthxk07.task_management_system.payload;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDetail {
  private Date timestamp;
  private String message;
  private String details;

}
