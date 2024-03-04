insert into transformation_prompts
  (type, prompt)
values
  ('Summary', 'From the following transcript extract a summary that highlights the key points in a succinct way. Return it in JSON in the following format: { text: string }.'),
  ('Tweet', 'Turn the following transcript into a witty and succinct tweet. Use simple and common words. Don''t use hashtags. Return it in JSON in the following format: { text: string }.'),
  ('Formal email', 'From the following transcript, create a formal email with a clear and crisp tone. Return it in JSON in the following format: { text: string }.'),
  ('Tweet Thread', 'From the following transcript, create a Twitter thread by segmenting the transcript into its main themes and concepts, expanding on them to build an engaging narrative, summarizing these into succinct, engaging tweets under 280 characters each, and organizing them in a narrative flow that resonates with Twitter audiences, without using hashtags. Separate each tweet by 2 new lines. Return the output in JSON in this format: { text: [string, string, ...] }');