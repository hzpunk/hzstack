# Вклад в проект (HZ Base)

## Как заводить задачи
- Feature: используйте шаблон `docs/templates/issue_feature.md`
- Bug: используйте шаблон `docs/templates/issue_bug.md`

## Ветки и коммиты
- Ветки: `feature/<scope>-<short-title>`, `fix/<scope>-<short-title>`
- Коммиты: Conventional Commits (пример: `feat(auth): add jwt rotation`)

## Pull Request
- Используйте шаблон `docs/templates/pr.md`
- Требования до merge:
  - Зелёные статпроверки (линт, тесты, сборка)
  - Обновлённая документация при изменении поведения
  - ADR при архитектурных изменениях

## Тестирование
- Уровни: unit (обяз.), integration (по месту), e2e (по месту)
- Минимальное покрытие — определяется проектом

## Релизы
- SemVer
- Changelog обязателен
