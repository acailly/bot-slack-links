# bot-slack-links

Retrieve links posted on slack in the channel you are in

## Usage

```
Usage: slack-links [options]

  Alias: sll

  Gather links posted on slack in channels you're in

  Options:

    --help  output usage information
```

## Config (config.yaml)

```yaml
slackLinks:
  token: insert_your_token_here
  excludeIfContains:
    - "insert_your_slack_domain.slack.com"
```

## How do I get my token?

Go to https://api.slack.com/custom-integrations/legacy-tokens#legacy_token_generator

Click on `Create a token`

Copy it and paste it in the `config.yaml` file as in the example above
