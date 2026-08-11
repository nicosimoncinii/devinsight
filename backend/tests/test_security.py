from app.core.security import generate_token, hash_token, tokens_match


def test_generated_tokens_are_random_and_stored_as_hashes() -> None:
    first = generate_token()
    second = generate_token()

    assert first != second
    assert len(first) >= 40
    assert hash_token(first) != first
    assert len(hash_token(first)) == 64


def test_token_comparison_rejects_different_values() -> None:
    assert tokens_match("same", "same") is True
    assert tokens_match("first", "second") is False
